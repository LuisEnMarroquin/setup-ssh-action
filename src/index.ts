import { setFailed, info } from "@actions/core";
import { InputValidator } from "./input-validator";
import { SSHManager } from "./ssh-manager";
import { GitManager } from "./git-manager";

async function run(): Promise<void> {
  try {
    info("Starting SSH Action setup");

    const validator = new InputValidator();
    const sshManager = new SSHManager();
    const gitManager = new GitManager();

    // Get and validate inputs
    const inputs = validator.getAndValidateInputs();
    const sshConfig = validator.inputsToSSHConfig(inputs);

    // Setup SSH
    await sshManager.setupSSH(sshConfig);

    // Configure Git
    await gitManager.configureGit();

    info("SSH Action setup completed successfully");
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    setFailed(errorMessage);
  }
}

// Run the action
run();