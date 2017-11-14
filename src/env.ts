import * as fs from 'fs';
import * as path from 'path';

/**
 * This file should contain information about AWS Beanstalk configuration
 * for this server. This includes the commit ID and branch name and possibly
 * other information.
 * The file should be written on CodeBuild and deployed with the app so that it can
 * be accessed at runtime.
 */
const ENV_FILE_PATH = path.join(process.cwd(), 'env.json');

type EnvDescriptor = {
  BRANCH?: string;
  COMMIT_ID?: string;
};

function tryGetEnv(): EnvDescriptor {
  try {
    return JSON.parse(fs.readFileSync(ENV_FILE_PATH, 'utf8'));
  } catch (e) {
    return {};
  }
}

const env = {
  // Provide some default values in case the file does not exist
  ...tryGetEnv(),
};

export { env };
