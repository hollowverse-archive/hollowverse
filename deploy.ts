import chalk = require('chalk')
import shelljs = require('shelljs')

print(chalk.green.bold('Building JavaScript and CSS files...'))
shelljs.exec('npm run client/build')

print(chalk.green.bold('Deploying to Firebase...'))
shelljs.exec('"./node_modules/.bin/firebase" deploy')

print(chalk.green.bold('Done'))

function print(text: string) {
  console.log('\n', text, '\n')
}
