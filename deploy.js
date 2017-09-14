#! /usr/bin/env node

const shelljs = require('shelljs');
const decryptSecrets = require('@hollowverse/common/helpers/decryptSecrets');
const executeCommands = require('@hollowverse/common/helpers/executeCommands');
const writeJsonFile = require('@hollowverse/common/helpers/writeJsonFile');
const createZipFile = require('@hollowverse/common/helpers/createZipFile');

const { ENC_PASS_SUMO, IS_PULL_REQUEST, BRANCH, COMMIT_ID } = shelljs.env;

const isPullRequest = IS_PULL_REQUEST !== 'false';

const secrets = [
  {
    password: ENC_PASS_SUMO,
    decryptedFilename: 'sumo.json',
  },
];

async function main() {
  const buildCommands = ['yarn test', 'yarn server/build', 'yarn client/build'];
  const deploymentCommands = [
    () =>
      writeJsonFile('env.json', {
        BRANCH,
        COMMIT_ID,
      }),
    () => decryptSecrets(secrets, './secrets'),
    () =>
      createZipFile(
        'build.zip',
        [
          'client/dist/**/*',
          'server/dist/**/*',
          'secrets/**/*',
          'common/**/*',
          'yarn.lock',
          'package.json',
          'env.json',
          'Dockerfile',
          '.dockerignore',
        ],
        ['secrets/**/*.enc'],
      ),
    `eb use ${BRANCH}`,
    'eb deploy --staged',
  ];

  let isDeployment = false;
  if (isPullRequest === true) {
    console.info('Skipping deployment commands in PRs');
  } else if (secrets.some(secret => secret.password === undefined)) {
    console.info(
      'Skipping deployment commands because some secrets are not provided',
    );
  } else {
    isDeployment = true;
  }

  try {
    await executeCommands(
      isDeployment ? [...buildCommands, ...deploymentCommands] : buildCommands,
    );
  } catch (e) {
    console.error('Build/deployment failed:', e);
    process.exit(1);
  }
}

main();
