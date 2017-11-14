#! /usr/bin/env node

const shelljs = require('shelljs');
const decryptSecrets = require('@hollowverse/common/helpers/decryptSecrets');
const executeCommand = require('@hollowverse/common/helpers/executeCommand');
const executeCommands = require('@hollowverse/common/helpers/executeCommands');
const writeJsonFile = require('@hollowverse/common/helpers/writeJsonFile');
const createZipFile = require('@hollowverse/common/helpers/createZipFile');

const {
  ENC_PASS_SUMO,
  IS_PULL_REQUEST,
  PROJECT,
  BRANCH,
  COMMIT_ID,
} = shelljs.env;

const isPullRequest = IS_PULL_REQUEST !== 'false';

const secrets = [
  {
    password: ENC_PASS_SUMO,
    decryptedFilename: 'sumo.json',
  },
];

const ebEnvironmentName = `${PROJECT}-${BRANCH}`;

async function main() {
  const buildCommands = ['yarn test', 'yarn build'];
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
          'dist/**/*',
          'secrets/**/*',
          'yarn.lock',
          'package.json',
          'env.json',
          'Dockerfile',
          '.dockerignore',
        ],
        ['secrets/**/*.enc'],
      ),
    // Use the Elastic Beanstalk environment of this branch (create it if necessary)
    () => {
      const environments = shelljs
        .exec('eb list')
        .stdout.trim()
        .split('\n');
      if (environments.indexOf(ebEnvironmentName) === -1) {
        return executeCommand(`eb create ${ebEnvironmentName}`);
      }
      return undefined;
    },
    `eb use ${ebEnvironmentName}`,
    'eb deploy --staged --debug',
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
