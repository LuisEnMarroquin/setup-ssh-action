import { getInput } from "@actions/core";
import { validateSSHKey, validatePort, validateOrigin } from "./utils";
import type { ActionInputs, SSHConfig } from "./types";

export class InputValidator {
  public getAndValidateInputs(): ActionInputs {
    const inputs: ActionInputs = {
      NAME: getInput("NAME") || undefined,
      PORT: getInput("PORT") || undefined,
      USER: getInput("USER") || undefined,
      ORIGIN: getInput("ORIGIN") || "github.com",
      SSHKEY: getInput("SSHKEY")
    };

    this.validateInputs(inputs);
    return inputs;
  }

  private validateInputs(inputs: ActionInputs): void {
    if (!inputs.SSHKEY) {
      throw new Error("SSHKEY input is required");
    }

    validateSSHKey(inputs.SSHKEY);
    validatePort(inputs.PORT);
    validateOrigin(inputs.ORIGIN);

    if (inputs.NAME && inputs.NAME.length > 255) {
      throw new Error("NAME must be 255 characters or less");
    }

    if (inputs.USER && inputs.USER.length > 32) {
      throw new Error("USER must be 32 characters or less");
    }
  }

  public inputsToSSHConfig(inputs: ActionInputs): SSHConfig {
    return {
      name: inputs.NAME,
      port: inputs.PORT,
      user: inputs.USER,
      origin: inputs.ORIGIN || "github.com",
      sshKey: inputs.SSHKEY
    };
  }
}