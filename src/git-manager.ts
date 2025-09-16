import { context } from "@actions/github";
import { info, warning } from "@actions/core";
import { executeCommand } from "./utils";
import type { GitConfig } from "./types";

export class GitManager {
  public async configureGit(): Promise<void> {
    try {
      const gitConfig = this.extractGitConfig();
      await this.setGitConfig(gitConfig);
      info("Git configuration completed successfully");
    } catch (error) {
      warning(`Git configuration failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  private extractGitConfig(): GitConfig {
    const payload = context?.payload || {};

    // Try to get user info from GitHub context
    let userName = "";
    let userEmail = "";

    if (payload.pusher) {
      userName = payload.pusher.name || "";
      userEmail = payload.pusher.email || "";
    } else if (payload.head_commit?.author) {
      userName = payload.head_commit.author.name || "";
      userEmail = payload.head_commit.author.email || "";
    }

    // If we still don't have email but have userName from pusher/author, try actor fallback for email
    if (!userEmail && context.actor) {
      userEmail = `${context.actor}@users.noreply.github.com`;
    }

    // If we still don't have userName, try actor
    if (!userName && context.actor) {
      userName = context.actor;
    }

    // Fallback to generic values if nothing found
    if (!userName) {
      userName = "GitHub Action";
      warning("Could not determine git user name, using fallback");
    }

    if (!userEmail) {
      userEmail = "action@github.com";
      warning("Could not determine git user email, using fallback");
    }

    info(`Configuring git with user: ${userName} <${userEmail}>`);

    return { userName, userEmail };
  }

  private async setGitConfig(config: GitConfig): Promise<void> {
    if (config.userName) {
      executeCommand(`git config --global user.name "${config.userName}"`);
    }

    if (config.userEmail) {
      executeCommand(`git config --global user.email "${config.userEmail}"`);
    }
  }
}