const { execSync } = require('child_process')
const { readFileSync } = require('fs')

const exec = (command) => console.log(execSync(command, { encoding: 'utf-8', timeout: 1000 * 60 }))
const arguments = [...process.argv].slice(2)

if (arguments.length === 0) {
  console.log('Send me the commit message')
} else {
  const commitMessage = arguments.join(' ')
  const tagVersion = JSON.parse(readFileSync('package.json')).version
  exec('npm update')
  exec('npm run build')
  exec('git add .')
  exec(`git commit -m "${commitMessage}"`)
  exec(`git tag -a -m "Published v${tagVersion}" v${tagVersion}`)
  exec('git push --follow-tags')
}
