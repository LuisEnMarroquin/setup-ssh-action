import { validateSSHKey, validatePort, validateOrigin, getPlatform } from '../src/utils';

describe('Utils', () => {
  describe('validateSSHKey', () => {
    it('should accept valid RSA private key', () => {
      const validKey = '-----BEGIN RSA PRIVATE KEY-----\nMIIEpAIBAAKCAQEA...';
      expect(() => validateSSHKey(validKey)).not.toThrow();
    });

    it('should accept valid OpenSSH private key', () => {
      const validKey = '-----BEGIN OPENSSH PRIVATE KEY-----\nb3BlbnNzaC1rZXktdjEAAAAA...';
      expect(() => validateSSHKey(validKey)).not.toThrow();
    });

    it('should accept valid SSH public key', () => {
      const validKey = 'ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABgQC...';
      expect(() => validateSSHKey(validKey)).not.toThrow();
    });

    it('should accept valid ED25519 key', () => {
      const validKey = 'ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAI...';
      expect(() => validateSSHKey(validKey)).not.toThrow();
    });

    it('should reject empty SSH key', () => {
      expect(() => validateSSHKey('')).toThrow('SSH key is required and cannot be empty');
    });

    it('should reject invalid SSH key format', () => {
      const invalidKey = 'invalid-key-format';
      expect(() => validateSSHKey(invalidKey)).toThrow('Invalid SSH key format');
    });

    it('should reject whitespace-only SSH key', () => {
      expect(() => validateSSHKey('   ')).toThrow('SSH key is required and cannot be empty');
    });
  });

  describe('validatePort', () => {
    it('should accept undefined port', () => {
      expect(() => validatePort(undefined)).not.toThrow();
    });

    it('should accept valid port numbers', () => {
      expect(() => validatePort('22')).not.toThrow();
      expect(() => validatePort('80')).not.toThrow();
      expect(() => validatePort('443')).not.toThrow();
      expect(() => validatePort('8080')).not.toThrow();
      expect(() => validatePort('65535')).not.toThrow();
    });

    it('should reject invalid port numbers', () => {
      expect(() => validatePort('0')).toThrow('Port must be a valid number between 1 and 65535');
      expect(() => validatePort('65536')).toThrow('Port must be a valid number between 1 and 65535');
      expect(() => validatePort('-1')).toThrow('Port must be a valid number between 1 and 65535');
      expect(() => validatePort('abc')).toThrow('Port must be a valid number between 1 and 65535');
    });
  });

  describe('validateOrigin', () => {
    it('should accept undefined origin', () => {
      expect(() => validateOrigin(undefined)).not.toThrow();
    });

    it('should accept valid hostnames', () => {
      expect(() => validateOrigin('github.com')).not.toThrow();
      expect(() => validateOrigin('example.org')).not.toThrow();
      expect(() => validateOrigin('my-server.local')).not.toThrow();
    });

    it('should accept valid IP addresses', () => {
      expect(() => validateOrigin('192.168.1.1')).not.toThrow();
      expect(() => validateOrigin('10.0.0.1')).not.toThrow();
      expect(() => validateOrigin('127.0.0.1')).not.toThrow();
    });

    it('should handle edge cases gracefully', () => {
      // These should not throw but might generate warnings
      expect(() => validateOrigin('_invalid')).not.toThrow();
      expect(() => validateOrigin('invalid.')).not.toThrow();
    });
  });

  describe('getPlatform', () => {
    it('should detect platform correctly', () => {
      const platform = getPlatform();

      expect(platform).toHaveProperty('isWindows');
      expect(platform).toHaveProperty('isMacOS');
      expect(platform).toHaveProperty('isLinux');

      expect(typeof platform.isWindows).toBe('boolean');
      expect(typeof platform.isMacOS).toBe('boolean');
      expect(typeof platform.isLinux).toBe('boolean');
    });

    it('should have exactly one platform as true', () => {
      const platform = getPlatform();
      const trueCount = [platform.isWindows, platform.isMacOS, platform.isLinux]
        .filter(Boolean).length;

      expect(trueCount).toBe(1);
    });
  });
});