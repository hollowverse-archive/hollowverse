import * as chalk from 'chalk'
import * as shelljs from 'shelljs'

(shelljs as any).set('-e')

if (
  shelljs.env['TRAVIS_BRANCH'] !== 'master' ||
  shelljs.env['TRAVIS_PULL_REQUEST'] !== 'false'
) {
  shelljs.exit(0)
}

print(chalk.green.bold('Deployment started...'))

print(chalk.green.bold('Building JavaScript and CSS files...'))
shelljs.exec('npm run client/build')

print(chalk.green.bold('`npm install` in Firebase `functions/`...'))
shelljs.cd('functions/')
shelljs.exec('npm install')
shelljs.cd('..')

print(chalk.green.bold('Deploying to Firebase...'))
shelljs.exec(`"./node_modules/.bin/firebase" deploy --token "${shelljs.env['FIREBASE_TOKEN']}"`)

print(chalk.green.bold('Done'))

function print(text: string) {
  console.log('\n', text, '\n')
}
