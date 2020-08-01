const { getInput, setFailed } = require('@actions/core')
const { mkdirSync, writeFileSync } = require('fs')
const { context } = require('@actions/github')
const { execSync } = require('child_process')

try {
  let exec = (command) => {
    console.log('exec', command.length, command)
    let result = execSync(command, { encoding: 'utf-8' })
    console.log(result)
    return result
  }

  let ORIGIN = getInput('ORIGIN')
  let SSHKEY = getInput('SSHKEY')

  const sshFolder = '~/.ssh/'
  const sshConfig = '~/.ssh/config'
  const sshAccess = '~/.ssh/access'

  mkdirSync(sshFolder)
  writeFileSync(sshConfig, `Host ${ORIGIN}\n  HostName ${ORIGIN}\n  IdentityFile ${sshAccess}\n  StrictHostKeyChecking no\n`)
  writeFileSync(sshAccess, SSHKEY)

  let userName = ''
  let userEmail = ''
  let payload = context.payload || {}
  try {
    userName = payload.pusher ? (payload.pusher.name || userName) : userName
    userEmail = payload.pusher ? (payload.pusher.email || userEmail) : userEmail
  } catch (error) {
    console.error({ error })
  }

  if (userName !== '' || userEmail !== '') {
    exec(`git config --global user.name "${userName}"`)
    exec(`git config --global user.email "${userEmail}"`)
  }
} catch (error) {
  setFailed(error.message)
}
