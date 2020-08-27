const { getInput, setFailed } = require('@actions/core')
const { mkdirSync, writeFileSync } = require('fs')
const { context } = require('@actions/github')
const { execSync } = require('child_process')
const { homedir } = require('os')
const { join } = require('path')

try {
  let exec = (command) => {
    console.log('exec', command.length, command)
    let result = execSync(command, { encoding: 'utf-8' })
    console.log(result)
    return result
  }

  let NAME = getInput('NAME')
  let PORT = getInput('PORT')
  let USER = getInput('USER')
  let ORIGIN = getInput('ORIGIN')
  let SSHKEY = getInput('SSHKEY')

  let home = homedir()
  let sshFolder = join(home, '.ssh/')
  let sshConfig = join(home, '.ssh', 'config')
  let sshAccess = join(home, '.ssh', 'access')

  let portSSH = (PORT ? `  Port ${PORT}\n` : '')
  let userSSH = (USER ? `  User ${USER}\n` : '')
  let accessText = `Host ${NAME || ORIGIN}\n  HostName ${ORIGIN}\n${userSSH}${portSSH}  IdentityFile ${sshAccess}\n  StrictHostKeyChecking no\n`

  exec(`pwd`)
  console.log({ home }, { sshFolder }, '\n')
  if (process.platform !== 'win32') exec(`rm -rf ${sshFolder} || true`)
  else {
    try {
      exec('(dir 2>&1 *`|echo CMD);&<# rem #>echo PowerShell')
    } catch (error) {
      console.log(`Can't determine if you are using CMD or PowerShell`, { error })
    }
    try {
      exec(`rmdir ${sshFolder} /s /q`)
    } catch (error) {
      console.log(`Can't delete ${sshFolder} folder`, { error })
    }
  }

  mkdirSync(sshFolder)
  writeFileSync(sshConfig, accessText)
  writeFileSync(sshAccess, SSHKEY)
  exec('cat ~/.ssh/config')

  if (process.platform !== 'win32') exec(`chmod 755 ${sshFolder}`)
  if (process.platform !== 'win32') exec(`chmod 600 ${sshAccess}`)

  let payload = context ? context.payload || {} : {}
  let userName = payload.pusher ? (payload.pusher.name || '') : ''
  let userEmail = payload.pusher ? (payload.pusher.email || '') : ''
  if (userName !== '') exec(`git config --global user.name "${userName}"`)
  if (userEmail !== '') exec(`git config --global user.email "${userEmail}"`)

  console.log({ payload })
} catch (error) {
  setFailed(error.message)
}
