#! /usr/bin/env node

/* eslint-disable no-console */
/* eslint import/no-extraneous-dependencies: ["error", {"devDependencies": true}] */

const shelljs = require('shelljs');
const {
  executeCommands,
} = require('@hollowverse/utils/helpers/executeCommands');

const { IS_PULL_REQUEST, BRANCH } = shelljs.env;

const isPullRequest = IS_PULL_REQUEST !== 'false';

const whitelistedBranches = ['master', 'beta', 'internal'];

async function main() {
  const buildCommands = [];
  const deploymentCommands = [
    `NODE_ENV=production serverless deploy --stage ${BRANCH} --aws-s3-accelerate`,
  ];

  let isDeployment = false;
  if (isPullRequest === true) {
    console.info('Skipping deployment commands in PRs');
    buildCommands.push(
      `NODE_ENV=production serverless package --stage ${BRANCH}`,
    );
  } else if (!whitelistedBranches.includes(BRANCH)) {
    console.info(
      `Skipping deployment because the branch "${BRANCH}" is not whitelisted`,
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
