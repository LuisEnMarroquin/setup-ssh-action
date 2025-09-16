import { SSHManager } from '../src/ssh-manager';
import { SSHConfig } from '../src/types';
import * as fs from 'fs';
import * as core from '@actions/core';
import * as utils from '../src/utils';

// Mock dependencies
jest.mock('fs');
jest.mock('@actions/core', () => ({
  info: jest.fn(),
  warning: jest.fn(),
  error: jest.fn(),
  setFailed: jest.fn(),
  getInput: jest.fn(),
}));
jest.mock('../src/utils');

const mockedFs = fs as jest.Mocked<typeof fs>;
const mockedCore = core as jest.Mocked<typeof core>;
const mockedUtils = utils as jest.Mocked<typeof utils>;

describe('SSHManager', () => {
  let sshManager: SSHManager;
  let mockConfig: SSHConfig;

  beforeEach(() => {
    mockConfig = {
      origin: 'github.com',
      sshKey: 'ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABgQC...',
      name: 'github',
      port: '22',
      user: 'git'
    };

    // Reset mocks
    jest.clearAllMocks();

    // Mock default implementations
    mockedFs.existsSync.mockReturnValue(false);
    mockedFs.mkdirSync.mockImplementation(() => '');
    mockedFs.writeFileSync.mockImplementation(() => {});
    mockedCore.info.mockImplementation(() => {});
    mockedCore.warning.mockImplementation(() => {});
    mockedUtils.executeCommand.mockReturnValue('');
    mockedUtils.getPlatform.mockReturnValue({
      isWindows: false,
      isMacOS: false,
      isLinux: true
    });

    // Create manager after setting up mocks
    sshManager = new SSHManager();
  });

  describe('setupSSH', () => {
    it('should setup SSH successfully on Linux', async () => {
      await sshManager.setupSSH(mockConfig);

      expect(mockedCore.info).toHaveBeenCalledWith('Setting up SSH for github.com');
      expect(mockedFs.mkdirSync).toHaveBeenCalled();
      expect(mockedFs.writeFileSync).toHaveBeenCalledTimes(2); // config and key
      expect(mockedUtils.executeCommand).toHaveBeenCalledWith(expect.stringContaining('chmod'));
      expect(mockedCore.info).toHaveBeenCalledWith('SSH setup completed successfully');
    });

    it('should setup SSH successfully on Windows', async () => {
      // Set up Windows platform before creating manager
      mockedUtils.getPlatform.mockReturnValue({
        isWindows: true,
        isMacOS: false,
        isLinux: false
      });

      const windowsManager = new SSHManager();

      await windowsManager.setupSSH(mockConfig);

      expect(mockedCore.info).toHaveBeenCalledWith('Setting up SSH for github.com');
      expect(mockedFs.mkdirSync).toHaveBeenCalled();
      expect(mockedFs.writeFileSync).toHaveBeenCalledTimes(2);
      expect(mockedCore.info).toHaveBeenCalledWith('Skipping permission setting on Windows');
    });

    it('should handle existing SSH folder on Linux', async () => {
      // Ensure Linux platform
      mockedUtils.getPlatform.mockReturnValue({
        isWindows: false,
        isMacOS: false,
        isLinux: true
      });

      const linuxManager = new SSHManager();
      mockedFs.existsSync.mockReturnValue(true);

      await linuxManager.setupSSH(mockConfig);

      expect(mockedUtils.executeCommand).toHaveBeenCalledWith(expect.stringContaining('rm -rf'));
    });

    it('should create SSH config with all parameters', async () => {
      await sshManager.setupSSH(mockConfig);

      const writeConfigCall = mockedFs.writeFileSync.mock.calls.find(
        call => call[0].toString().includes('config')
      );

      expect(writeConfigCall).toBeDefined();
      const configContent = writeConfigCall![1] as string;

      expect(configContent).toContain('Host github');
      expect(configContent).toContain('HostName github.com');
      expect(configContent).toContain('User git');
      expect(configContent).toContain('Port 22');
      expect(configContent).toContain('StrictHostKeyChecking no');
    });

    it('should create SSH config without optional parameters', async () => {
      const minimalConfig: SSHConfig = {
        origin: 'github.com',
        sshKey: 'ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABgQC...'
      };

      await sshManager.setupSSH(minimalConfig);

      const writeConfigCall = mockedFs.writeFileSync.mock.calls.find(
        call => call[0].toString().includes('config')
      );

      expect(writeConfigCall).toBeDefined();
      const configContent = writeConfigCall![1] as string;

      expect(configContent).toContain('Host github.com');
      expect(configContent).toContain('HostName github.com');
      expect(configContent).not.toContain('User git');
      expect(configContent).not.toContain('Port 22');
    });

    it('should write SSH key correctly', async () => {
      await sshManager.setupSSH(mockConfig);

      const writeKeyCall = mockedFs.writeFileSync.mock.calls.find(
        call => call[0].toString().includes('access')
      );

      expect(writeKeyCall).toBeDefined();
      expect(writeKeyCall![1]).toBe(mockConfig.sshKey);
    });

    it('should handle errors gracefully', async () => {
      mockedFs.mkdirSync.mockImplementation(() => {
        throw new Error('Permission denied');
      });

      await expect(sshManager.setupSSH(mockConfig)).rejects.toThrow('SSH setup failed');
    });

    it('should verify setup by reading config', async () => {
      mockedUtils.executeCommand.mockReturnValue('Host github\n  HostName github.com');

      await sshManager.setupSSH(mockConfig);

      expect(mockedUtils.executeCommand).toHaveBeenCalledWith(expect.stringContaining('cat'));
    });

    it('should handle verification failure gracefully', async () => {
      mockedUtils.executeCommand.mockImplementation((cmd) => {
        if (cmd.includes('cat')) {
          throw new Error('File not found');
        }
        return '';
      });

      await sshManager.setupSSH(mockConfig);

      expect(mockedCore.warning).toHaveBeenCalledWith('Could not read SSH config file for verification');
    });
  });
});