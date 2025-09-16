export interface SSHConfig {
  name?: string;
  port?: string;
  user?: string;
  origin: string;
  sshKey: string;
}

export interface GitConfig {
  userName: string;
  userEmail: string;
}

export interface ActionInputs {
  NAME?: string;
  PORT?: string;
  USER?: string;
  ORIGIN?: string;
  SSHKEY: string;
}

export interface Platform {
  isWindows: boolean;
  isMacOS: boolean;
  isLinux: boolean;
}