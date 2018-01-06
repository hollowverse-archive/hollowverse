import * as SumoLogger from 'sumo-logger';

import * as fs from 'fs';
import * as path from 'path';
import { URL } from 'url';

import { noop, omit } from 'lodash';

import { env } from '../env';

const SECRETS_FILE_PATH = path.resolve(process.cwd(), 'secrets', 'sumo.json');
const sumoSecrets = JSON.parse(String(fs.readFileSync(SECRETS_FILE_PATH)));

const COLLECTOR_ID: string = sumoSecrets.collectorId;
const RECEIVER_URL =
  'https://endpoint2.collection.us2.sumologic.com/receiver/v1/http/';

const { BRANCH, COMMIT_ID } = env;

const sumoLogger = new SumoLogger({
  endpoint: new URL(COLLECTOR_ID, RECEIVER_URL).toString(),
  onSuccess: noop,
  sourceName: 'Elastic Beanstalk Server',
  sourceCategory: `${BRANCH}/${COMMIT_ID}`,
  onError() {
    console.error('Error');
  },
});

// Make sure to send all pending logs before the Node.js process exits
process.on('beforeExit', () => {
  sumoLogger.flushLogs();
});

export function log(data: any) {
  // Push a message to be logged
  sumoLogger.log(data);
}
