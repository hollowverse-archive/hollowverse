import * as shelljs from 'shelljs';

(shelljs as any).set('-e');

if (
  shelljs.env.TRAVIS_BRANCH === 'master' &&
  shelljs.env.TRAVIS_PULL_REQUEST === 'false'
) {
  shelljs.exec(
    `yarn deploy -- --non-interactive --token ${shelljs.env.FIREBASE_TOKEN}`,
  );
}
