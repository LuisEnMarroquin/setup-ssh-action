import { mkdirSync, writeFileSync, existsSync } from "fs";
import { homedir } from "os";
import { join } from "path";
import { info, warning } from "@actions/core";
import { executeCommand, getPlatform } from "./utils";
import type { SSHConfig } from "./types";

export class SSHManager {
  private readonly sshFolder: string;
  private readonly sshConfig: string;
  private readonly sshAccess: string;
  private readonly platform: any;

  constructor() {
    const home = homedir();
    this.sshFolder = join(home, ".ssh");
    this.sshConfig = join(this.sshFolder, "config");
    this.sshAccess = join(this.sshFolder, "access");
    this.platform = getPlatform();
  }

  public async setupSSH(config: SSHConfig): Promise<void> {
    try {
      info(`Setting up SSH for ${config.origin}`);

      await this.cleanupExistingSSH();
      await this.createSSHDirectory();
      await this.writeSSHConfig(config);
      await this.writeSSHKey(config.sshKey);
      await this.setPermissions();
      await this.verifySetup();

      info("SSH setup completed successfully");
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      throw new Error(`SSH setup failed: ${errorMessage}`);
    }
  }

  private async cleanupExistingSSH(): Promise<void> {
    info("Cleaning up existing SSH configuration");

    if (this.platform.isWindows) {
      await this.cleanupWindowsSSH();
    } else {
      await this.cleanupUnixSSH();
    }
  }

  private async cleanupWindowsSSH(): Promise<void> {
    try {
      // Detect shell type
      executeCommand("(dir 2>&1 *`|echo CMD);&<# rem #>echo PowerShell");
    } catch (error) {
      warning("Could not determine shell type (CMD/PowerShell)");
    }

    try {
      if (existsSync(this.sshFolder)) {
        executeCommand(`rmdir "${this.sshFolder}" /s /q`);
      }
    } catch (error) {
      info("SSH folder did not exist or could not be removed");
    }
  }

  private async cleanupUnixSSH(): Promise<void> {
    executeCommand("ps -p $$ || true");

    try {
      if (existsSync(this.sshFolder)) {
        executeCommand(`rm -rf "${this.sshFolder}"`);
      }
    } catch (error) {
      info("SSH folder did not exist or could not be removed");
    }
  }

  private async createSSHDirectory(): Promise<void> {
    info(`Creating SSH directory: ${this.sshFolder}`);
    mkdirSync(this.sshFolder, { recursive: true });
  }

  private async writeSSHConfig(config: SSHConfig): Promise<void> {
    const hostName = config.name || config.origin;
    const portConfig = config.port ? `  Port ${config.port}\n` : "";
    const userConfig = config.user ? `  User ${config.user}\n` : "";

    const configContent = `Host ${hostName}
  HostName ${config.origin}
${userConfig}${portConfig}  IdentityFile ${this.sshAccess}
  StrictHostKeyChecking no
  UserKnownHostsFile /dev/null
`;

    info("Writing SSH config file");
    writeFileSync(this.sshConfig, configContent);
  }

  private async writeSSHKey(sshKey: string): Promise<void> {
    info("Writing SSH private key");
    writeFileSync(this.sshAccess, sshKey);
  }

  private async setPermissions(): Promise<void> {
    if (this.platform.isWindows) {
      info("Skipping permission setting on Windows");
      return;
    }

    info("Setting SSH file permissions");
    executeCommand(`chmod 755 "${this.sshFolder}"`);
    executeCommand(`chmod 600 "${this.sshAccess}"`);
    executeCommand(`chmod 644 "${this.sshConfig}"`);
  }

  private async verifySetup(): Promise<void> {
    info("Verifying SSH setup");

    try {
      const configContent = executeCommand(`cat "${this.sshConfig}"`);
      info("SSH config file contents:");
      info(configContent);
    } catch (error) {
      warning("Could not read SSH config file for verification");
    }
  }
}