import * as fs from 'fs';
import * as path from 'path';

/**
 * This file should contain information about Google App Engine configuration
 * for this server. This includes the service and branch name and possibly
 * the instance name.
 * This is working around the fact that App Engine does not provide this information
 * as environment variables for Docker-based runtimes.
 * The file should be written on CI and deployed with the app so that it can
 * be accessed at runtime.
 */
const ENV_FILE_PATH = path.join(process.cwd(), 'env.json');

type EnvDescriptor = {
  branch?: string;
  service?: string;
  project?: string;
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
  project: 'hollowverse-c9cad',
  ...tryGetEnv(),
};

export default env;
