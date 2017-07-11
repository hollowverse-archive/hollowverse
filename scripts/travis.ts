import * as shelljs from 'shelljs'

(shelljs as any).set('-e')

shelljs.exec('yarn test')

if (
  shelljs.env.TRAVIS_BRANCH === 'master' &&
  shelljs.env.TRAVIS_PULL_REQUEST === 'false'
) {
  shelljs.exec('"./node_modules/.bin/ts-node" scripts/deploy.ts')
}
