import { GitManager } from '../src/git-manager';
import * as github from '@actions/github';
import * as core from '@actions/core';
import * as utils from '../src/utils';

// Mock dependencies
jest.mock('@actions/github');
jest.mock('@actions/core');
jest.mock('../src/utils');

const mockedGitHub = github as jest.Mocked<typeof github>;
const mockedCore = core as jest.Mocked<typeof core>;
const mockedUtils = utils as jest.Mocked<typeof utils>;

describe('GitManager', () => {
  let gitManager: GitManager;

  beforeEach(() => {
    gitManager = new GitManager();
    jest.clearAllMocks();

    // Mock default implementations
    mockedCore.info.mockImplementation(() => {});
    mockedCore.warning.mockImplementation(() => {});
    mockedUtils.executeCommand.mockReturnValue('');
  });

  describe('configureGit', () => {
    it('should configure git with pusher information', async () => {
      const mockPayload = {
        pusher: {
          name: 'John Doe',
          email: 'john@example.com'
        }
      };

      Object.defineProperty(mockedGitHub, 'context', {
        value: {
          payload: mockPayload,
          actor: 'johndoe'
        },
        writable: true
      });

      await gitManager.configureGit();

      expect(mockedUtils.executeCommand).toHaveBeenCalledWith('git config --global user.name "John Doe"');
      expect(mockedUtils.executeCommand).toHaveBeenCalledWith('git config --global user.email "john@example.com"');
      expect(mockedCore.info).toHaveBeenCalledWith('Configuring git with user: John Doe <john@example.com>');
    });

    it('should configure git with head commit author information', async () => {
      const mockPayload = {
        head_commit: {
          author: {
            name: 'Jane Smith',
            email: 'jane@example.com'
          }
        }
      };

      Object.defineProperty(mockedGitHub, 'context', {
        value: {
          payload: mockPayload,
          actor: 'janesmith'
        },
        writable: true
      });

      await gitManager.configureGit();

      expect(mockedUtils.executeCommand).toHaveBeenCalledWith('git config --global user.name "Jane Smith"');
      expect(mockedUtils.executeCommand).toHaveBeenCalledWith('git config --global user.email "jane@example.com"');
    });

    it('should use actor information when pusher/author not available', async () => {
      const mockPayload = {};

      Object.defineProperty(mockedGitHub, 'context', {
        value: {
          payload: mockPayload,
          actor: 'testuser'
        },
        writable: true
      });

      await gitManager.configureGit();

      expect(mockedUtils.executeCommand).toHaveBeenCalledWith('git config --global user.name "testuser"');
      expect(mockedUtils.executeCommand).toHaveBeenCalledWith('git config --global user.email "testuser@users.noreply.github.com"');
    });

    it('should use fallback values when no information available', async () => {
      Object.defineProperty(mockedGitHub, 'context', {
        value: {
          payload: {},
          actor: null
        },
        writable: true
      });

      await gitManager.configureGit();

      expect(mockedUtils.executeCommand).toHaveBeenCalledWith('git config --global user.name "GitHub Action"');
      expect(mockedUtils.executeCommand).toHaveBeenCalledWith('git config --global user.email "action@github.com"');
      expect(mockedCore.warning).toHaveBeenCalledWith('Could not determine git user name, using fallback');
      expect(mockedCore.warning).toHaveBeenCalledWith('Could not determine git user email, using fallback');
    });

    it('should handle partial pusher information', async () => {
      const mockPayload = {
        pusher: {
          name: 'John Doe'
          // email missing
        }
      };

      Object.defineProperty(mockedGitHub, 'context', {
        value: {
          payload: mockPayload,
          actor: 'johndoe'
        },
        writable: true
      });

      await gitManager.configureGit();

      expect(mockedUtils.executeCommand).toHaveBeenCalledWith('git config --global user.name "John Doe"');
      expect(mockedUtils.executeCommand).toHaveBeenCalledWith('git config --global user.email "johndoe@users.noreply.github.com"');
    });

    it('should handle git configuration errors gracefully', async () => {
      mockedUtils.executeCommand.mockImplementation(() => {
        throw new Error('Git config failed');
      });

      const mockPayload = {
        pusher: {
          name: 'John Doe',
          email: 'john@example.com'
        }
      };

      Object.defineProperty(mockedGitHub, 'context', {
        value: {
          payload: mockPayload,
          actor: 'johndoe'
        },
        writable: true
      });

      await gitManager.configureGit();

      expect(mockedCore.warning).toHaveBeenCalledWith('Git configuration failed: Git config failed');
    });

    it('should not set git config for empty values', async () => {
      const mockPayload = {
        pusher: {
          name: '',
          email: ''
        }
      };

      Object.defineProperty(mockedGitHub, 'context', {
        value: {
          payload: mockPayload,
          actor: ''
        },
        writable: true
      });

      await gitManager.configureGit();

      expect(mockedUtils.executeCommand).toHaveBeenCalledWith('git config --global user.name "GitHub Action"');
      expect(mockedUtils.executeCommand).toHaveBeenCalledWith('git config --global user.email "action@github.com"');
    });
  });
});