#! /bin/node

const shelljs = require('shelljs');
const decryptSecrets = require('@hollowverse/common-config/helpers/decryptSecrets');
const executeCommands = require('@hollowverse/common-config/helpers/executeCommands');
const retryCommand = require('@hollowverse/common-config/helpers/retryCommand');
const writeEnvFile = require('@hollowverse/common-config/helpers/writeEnvFile');

const {
  ENC_PASS_LETS_ENCRYPT,
  ENC_PASS_TRAVIS,
  ENC_PASS_SUMO,
  PROJECT,
  BRANCH,
} = shelljs.env;

const secrets = [
  {
    password: ENC_PASS_LETS_ENCRYPT,
    decryptedFilename: 'gcloud.letsEncrypt.json',
  },
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
  if (BRANCH !== 'master') {
    process.exit(0);
  }

  const code = await executeCommands([
    () => writeEnvFile('default', shelljs.env, './env.json'),
    () => decryptSecrets(secrets, './secrets'),
    `gcloud auth activate-service-account --key-file secrets/gcloud.travis.json`,
    // Remove Travis key file so it does not get deployed with the service
    'rm ./secrets/gcloud.travis.json*',
    () =>
      retryCommand(
        `gcloud app deploy app.yaml dispatch.yaml --project ${PROJECT} --version ${BRANCH} --quiet`,
      ),
  ]);

  process.exit(code);
}

main();
