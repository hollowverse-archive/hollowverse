import * as chalk from 'chalk'
import * as shelljs from 'shelljs'

(shelljs as any).set('-e')

print(chalk.green.bold('Building JavaScript and CSS files...'))
shelljs.exec('npm run client/build')

print(chalk.green.bold('Deploying to Firebase...'))
shelljs.exec('"./node_modules/.bin/firebase" deploy --token ${FIREBASE_TOKEN}')

print(chalk.green.bold('Done'))

function print(text: string) {
  console.log('\n', text, '\n')
}
