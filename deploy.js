#! /usr/bin/env node

const shelljs = require('shelljs');
const decryptSecrets = require('@hollowverse/common/helpers/decryptSecrets');
const executeCommands = require('@hollowverse/common/helpers/executeCommands');
const writeJSONFile = require('@hollowverse/common/helpers/writeJSONFile');

const {
  ENC_PASS_SUMO,
  IS_PULL_REQUEST,
  CODEBUILD_SOURCE_VERSION,
  CODEBUILD_RESOLVED_SOURCE_VERSION,
} = shelljs.env;

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
      writeJSONFile('env.json', {
        BRANCH: CODEBUILD_SOURCE_VERSION,
        COMMIT_ID: CODEBUILD_RESOLVED_SOURCE_VERSION,
      }),
    () => decryptSecrets(secrets, './secrets'),
  ];

  let isDeployment = false;
  if (isPullRequest === false) {
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
