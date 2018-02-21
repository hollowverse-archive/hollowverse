import SumoLogger from 'sumo-logger';
import bluebird from 'bluebird';
import { SourceMapConsumer } from 'source-map';

import fs from 'fs';
import path from 'path';
import { URL } from 'url';

import { noop } from 'lodash';

import { LoggedAction } from './types';
import { isActionOfType } from 'store/helpers';

const SECRETS_FILE_PATH = path.resolve(process.cwd(), 'secrets', 'sumo.json');
const sumoSecrets = JSON.parse(String(fs.readFileSync(SECRETS_FILE_PATH)));

const COLLECTOR_ID: string = sumoSecrets.collectorId;
const RECEIVER_URL =
  'https://endpoint2.collection.us2.sumologic.com/receiver/v1/http/';

const sumoLogger = new SumoLogger({
  endpoint: new URL(COLLECTOR_ID, RECEIVER_URL).toString(),
  onSuccess: noop,
  sourceName: 'Elastic Beanstalk Server',
  sourceCategory: `${__BRANCH__}/${__COMMIT_ID__}`,
  onError() {
    console.error('Error');
  },
});

// Make sure to send all pending logs before the Node.js process exits
process.on('beforeExit', () => {
  sumoLogger.flushLogs();
});

const transformActionForLogging = async (
  action: LoggedAction,
): Promise<LoggedAction> => {
  if (isActionOfType(action, 'UNHANDLED_ERROR_THROWN')) {
    const { message, source, line, column } = action.payload;
    if (source && line && column) {
      const sourceMap = await fetch(`${source}.map?branch=${__BRANCH__}`).then(
        async r => r.json(),
      );
      const consumer = new SourceMapConsumer(sourceMap);
      const originalPosition = consumer.originalPositionFor({ line, column });

      return {
        ...action,
        payload: {
          message,
          ...originalPosition,
        },
      };
    }
  }

  return action;
};

export async function log(actions: LoggedAction[]) {
  await bluebird
    .map(actions, transformActionForLogging)
    .each((action: LoggedAction) => {
      sumoLogger.log({
        ...action,
        timestamp: new Date(action.timestamp),
      });
    });
}
