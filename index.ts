import { getInput, setFailed } from "@actions/core";
import { mkdirSync, writeFileSync } from "fs";
import { context } from "@actions/github";
import { execSync } from "child_process";
import { homedir } from "os";
import { join } from "path";

try {
  let exec = (command: string) => {
    console.log("exec", command.length, command);
    let result = execSync(command, { encoding: "utf-8" });
    console.log(result);
  };

  let NAME = getInput("NAME");
  let PORT = getInput("PORT");
  let USER = getInput("USER");
  let ORIGIN = getInput("ORIGIN");
  let SSHKEY = getInput("SSHKEY");

  let home = homedir();
  let sshFolder = join(home, ".ssh/");
  let sshConfig = join(home, ".ssh", "config");
  let sshAccess = join(home, ".ssh", "access");

  let portSSH = PORT ? `  Port ${PORT}\n` : "";
  let userSSH = USER ? `  User ${USER}\n` : "";
  let accessText = `Host ${NAME || ORIGIN}\n  HostName ${ORIGIN}\n${userSSH}${portSSH}  IdentityFile ${sshAccess}\n  StrictHostKeyChecking no\n`;

  console.log({ home }, { sshFolder }, "\n");
  if (process.platform !== "win32") {
    exec(`ps -p $$ || true`);
    exec(`rm -rf ${sshFolder} || true`);
  } else {
    try {
      exec("(dir 2>&1 *`|echo CMD);&<# rem #>echo PowerShell");
    } catch (error) {
      console.log(`Can't determine if you are using CMD or PowerShell`, { error }, "\n");
    }
    try {
      exec(`rmdir ${sshFolder} /s /q`);
    } catch (error) {
      console.log(`Can't delete ${sshFolder}, don't worry probably doesn't exists yet`, { error }, "\n");
    }
  }

  mkdirSync(sshFolder);
  writeFileSync(sshConfig, accessText);
  writeFileSync(sshAccess, SSHKEY);
  exec("cat ~/.ssh/config");

  if (process.platform !== "win32") exec(`chmod 755 ${sshFolder}`);
  if (process.platform !== "win32") exec(`chmod 600 ${sshAccess}`);

  let payload = context ? context.payload || {} : {};
  let userName = "LuisEnMarroquin",
    userEmail = "mluis651@gmail.com";
  userName = payload.pusher ? payload.pusher.name || userName : userName;
  userEmail = payload.pusher ? payload.pusher.email || userEmail : userEmail;
  if (userName !== "") exec(`git config --global user.name "${userName}"`);
  if (userEmail !== "") exec(`git config --global user.email "${userEmail}"`);

  console.log({ payload });
} catch (error) {
  setFailed(error.message);
}
