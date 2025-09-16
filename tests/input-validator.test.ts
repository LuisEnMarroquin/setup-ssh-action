import { InputValidator } from '../src/input-validator';
import * as core from '@actions/core';

// Mock @actions/core
jest.mock('@actions/core', () => ({
  getInput: jest.fn(),
}));

const mockedCore = core as jest.Mocked<typeof core>;

describe('InputValidator', () => {
  let validator: InputValidator;

  beforeEach(() => {
    validator = new InputValidator();
    jest.clearAllMocks();
  });

  describe('getAndValidateInputs', () => {
    it('should return valid inputs with defaults', () => {
      mockedCore.getInput.mockImplementation((name: string) => {
        switch (name) {
          case 'SSHKEY':
            return 'ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABgQC...';
          case 'ORIGIN':
            return '';
          default:
            return '';
        }
      });

      const inputs = validator.getAndValidateInputs();

      expect(inputs.SSHKEY).toBe('ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABgQC...');
      expect(inputs.ORIGIN).toBe('github.com');
      expect(inputs.NAME).toBeUndefined();
      expect(inputs.PORT).toBeUndefined();
      expect(inputs.USER).toBeUndefined();
    });

    it('should return all provided inputs', () => {
      mockedCore.getInput.mockImplementation((name: string) => {
        switch (name) {
          case 'SSHKEY':
            return 'ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABgQC...';
          case 'ORIGIN':
            return 'example.com';
          case 'NAME':
            return 'myserver';
          case 'PORT':
            return '2222';
          case 'USER':
            return 'admin';
          default:
            return '';
        }
      });

      const inputs = validator.getAndValidateInputs();

      expect(inputs.SSHKEY).toBe('ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABgQC...');
      expect(inputs.ORIGIN).toBe('example.com');
      expect(inputs.NAME).toBe('myserver');
      expect(inputs.PORT).toBe('2222');
      expect(inputs.USER).toBe('admin');
    });

    it('should throw error when SSHKEY is missing', () => {
      mockedCore.getInput.mockImplementation(() => '');

      expect(() => validator.getAndValidateInputs()).toThrow('SSHKEY input is required');
    });

    it('should throw error for invalid SSH key', () => {
      mockedCore.getInput.mockImplementation((name: string) => {
        switch (name) {
          case 'SSHKEY':
            return 'invalid-key';
          default:
            return '';
        }
      });

      expect(() => validator.getAndValidateInputs()).toThrow('Invalid SSH key format');
    });

    it('should throw error for invalid port', () => {
      mockedCore.getInput.mockImplementation((name: string) => {
        switch (name) {
          case 'SSHKEY':
            return 'ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABgQC...';
          case 'PORT':
            return '99999';
          default:
            return '';
        }
      });

      expect(() => validator.getAndValidateInputs()).toThrow('Port must be a valid number between 1 and 65535');
    });

    it('should throw error for NAME too long', () => {
      mockedCore.getInput.mockImplementation((name: string) => {
        switch (name) {
          case 'SSHKEY':
            return 'ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABgQC...';
          case 'NAME':
            return 'a'.repeat(256);
          default:
            return '';
        }
      });

      expect(() => validator.getAndValidateInputs()).toThrow('NAME must be 255 characters or less');
    });

    it('should throw error for USER too long', () => {
      mockedCore.getInput.mockImplementation((name: string) => {
        switch (name) {
          case 'SSHKEY':
            return 'ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABgQC...';
          case 'USER':
            return 'a'.repeat(33);
          default:
            return '';
        }
      });

      expect(() => validator.getAndValidateInputs()).toThrow('USER must be 32 characters or less');
    });
  });

  describe('inputsToSSHConfig', () => {
    it('should convert inputs to SSH config correctly', () => {
      const inputs = {
        NAME: 'myserver',
        PORT: '2222',
        USER: 'admin',
        ORIGIN: 'example.com',
        SSHKEY: 'ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABgQC...'
      };

      const config = validator.inputsToSSHConfig(inputs);

      expect(config.name).toBe('myserver');
      expect(config.port).toBe('2222');
      expect(config.user).toBe('admin');
      expect(config.origin).toBe('example.com');
      expect(config.sshKey).toBe('ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABgQC...');
    });

    it('should handle minimal inputs', () => {
      const inputs = {
        SSHKEY: 'ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABgQC...',
        ORIGIN: 'github.com'
      };

      const config = validator.inputsToSSHConfig(inputs);

      expect(config.name).toBeUndefined();
      expect(config.port).toBeUndefined();
      expect(config.user).toBeUndefined();
      expect(config.origin).toBe('github.com');
      expect(config.sshKey).toBe('ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABgQC...');
    });
  });
});