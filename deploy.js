#! /usr/bin/env node

const shelljs = require('shelljs');
const decryptSecrets = require('@hollowverse/common/helpers/decryptSecrets');
const executeCommands = require('@hollowverse/common/helpers/executeCommands');
const retryCommand = require('@hollowverse/common/helpers/retryCommand');
const writeEnvFile = require('@hollowverse/common/helpers/writeEnvFile');

const {
  ENC_PASS_TRAVIS,
  ENC_PASS_SUMO,
  IS_PULL_REQUEST,
  PROJECT,
  BRANCH,
} = shelljs.env;

const isPullRequest = IS_PULL_REQUEST !== 'false';

const secrets = [
  {
    password: ENC_PASS_TRAVIS,
    decryptedFilename: 'gcloud.travis.json',
  },
  {
    password: ENC_PASS_SUMO,
    decryptedFilename: 'sumo.json',
  },
];

async function main() {
  const buildCommands = ['yarn test', 'yarn server/build', 'yarn client/build'];

  const deploymentCommands = [
    () => writeEnvFile('default', shelljs.env, './env.json'),
    () => decryptSecrets(secrets, './secrets'),
    `gcloud auth activate-service-account --key-file secrets/gcloud.travis.json`,
    // Remove Travis key file so it does not get deployed with the service
    () => {
      shelljs.rm('./secrets/gcloud.travis.json*');
      return 0;
    },
    () => {
      const yamlFiles = ['app.yaml'];
      let promoteFlag = '--no-promote';

      if (BRANCH === 'master') {
        yamlFiles.push('dispatch.yaml');
        promoteFlag = '--promote';
      }

      return retryCommand(
        `gcloud app deploy ${yamlFiles.join(
          ' ',
        )} --project ${PROJECT} --version ${BRANCH} ${promoteFlag} --quiet`,
      );
    },
  ];

  let commands;
  if (isPullRequest === false) {
    commands = [...buildCommands, ...deploymentCommands];
  } else {
    commands = buildCommands;
    console.info('Skipping deployment commands in PRs');
  }

  const code = await executeCommands(commands);

  process.exit(code);
}

main();
