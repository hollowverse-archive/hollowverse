import * as shelljs from 'shelljs'

(shelljs as any).set('-e')

shelljs.exec('npm run test')
shelljs.exec('"./node_modules/.bin/ts-node" scripts/deploy.ts')
