import SumoLogger from 'sumo-logger';
import bluebird from 'bluebird';
import { SourceMapConsumer } from 'source-map';

import { URL } from 'url';

import { noop } from 'lodash';

import { LoggedAction } from './types';
import { isActionOfType } from '../app/store/helpers';

const { BRANCH, COMMIT_ID, COLLECTOR_ID } = process.env;

const RECEIVER_URL =
  'https://endpoint2.collection.us2.sumologic.com/receiver/v1/http/';

const sumoLogger = new SumoLogger({
  // tslint:disable-next-line:no-non-null-assertion
  endpoint: new URL(COLLECTOR_ID!, RECEIVER_URL).toString(),
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

const transformActionForLogging = async (
  action: LoggedAction,
): Promise<LoggedAction> => {
  if (isActionOfType(action, 'UNHANDLED_ERROR_THROWN')) {
    const { message, source, line, column } = action.payload;
    if (source && line && column) {
      const sourceMap = await fetch(`${source}.map?branch=${BRANCH}`).then(
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
