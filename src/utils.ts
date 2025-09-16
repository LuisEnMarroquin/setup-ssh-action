import { execSync } from "child_process";
import { info, warning, error as coreError } from "@actions/core";
import type { Platform } from "./types";

export function executeCommand(command: string): string {
  try {
    info(`Executing: ${command}`);
    const result = execSync(command, { encoding: "utf-8" });
    info(`Command completed successfully`);
    return result;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    coreError(`Command failed: ${command}. Error: ${errorMessage}`);
    throw new Error(`Command execution failed: ${errorMessage}`);
  }
}

export function getPlatform(): Platform {
  const platform = process.platform;
  return {
    isWindows: platform === "win32",
    isMacOS: platform === "darwin",
    isLinux: platform === "linux"
  };
}

export function validateSSHKey(sshKey: string): boolean {
  if (!sshKey || sshKey.trim().length === 0) {
    throw new Error("SSH key is required and cannot be empty");
  }

  const validKeyPatterns = [
    /^-----BEGIN [A-Z ]+-----/,
    /^ssh-rsa /,
    /^ssh-ed25519 /,
    /^ssh-dss /,
    /^ecdsa-sha2-/
  ];

  const isValid = validKeyPatterns.some(pattern => pattern.test(sshKey.trim()));

  if (!isValid) {
    throw new Error("Invalid SSH key format. Please provide a valid SSH private key or public key.");
  }

  return true;
}

export function validatePort(port?: string): boolean {
  if (!port) return true; // Port is optional

  const portNumber = parseInt(port, 10);
  if (isNaN(portNumber) || portNumber < 1 || portNumber > 65535) {
    throw new Error("Port must be a valid number between 1 and 65535");
  }

  return true;
}

export function validateOrigin(origin?: string): boolean {
  if (!origin) return true; // Will use default

  const validOriginPattern = /^[a-zA-Z0-9][a-zA-Z0-9-._]*[a-zA-Z0-9]$|^[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}$/;

  if (!validOriginPattern.test(origin)) {
    warning(`Origin "${origin}" may not be a valid hostname or IP address`);
  }

  return true;
}