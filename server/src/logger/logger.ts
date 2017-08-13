import * as SumoLogger from 'sumo-logger';

import * as fs from 'fs';
import * as path from 'path';
import { URL } from 'url';

import { LogPayload, LogType } from './types';

import noop from 'lodash/noop';

const SECRETS_FILE_PATH = path.join(process.cwd(), 'secrets', 'sumo.json');
const sumoSecrets = JSON.parse(String(fs.readFileSync(SECRETS_FILE_PATH)));

const COLLECTOR_ID: string = sumoSecrets.collectorId;
const RECEIVER_URL =
  'https://endpoint2.collection.us2.sumologic.com/receiver/v1/http/';

const sumoLogger = new SumoLogger({
  endpoint: new URL(COLLECTOR_ID, RECEIVER_URL).toString(),
  onSuccess: noop,
  onError() {
    console.error('Error');
  },
});

// Make sure to send all pending logs before the Node.js process exits
process.on('beforeExit', () => {
  sumoLogger.flushLogs();
});

/**
 * A wrapper around `SummoLogger.log` to enforce strict type checking
 * for an event's type and payload.
 */
export function log<T extends LogType>(type: T, data: LogPayload<T>) {
  // Push a message to be logged
  sumoLogger.log({
    type,
    // tslint:disable-next-line no-suspicious-comment
    // @FIXME: Type cast to work around TS issue
    ...data as object,
  });
}
