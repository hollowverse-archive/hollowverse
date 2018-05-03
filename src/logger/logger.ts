// tslint:disable no-console

import bluebird from 'bluebird';
import { SourceMapConsumer } from 'source-map';
import got from 'got';
import { URL } from 'url';

import { LoggedAction } from './types';
import { isActionOfType } from '../app/store/helpers';

const { BRANCH, COMMIT_ID, SUMO_COLLECTOR_ID } = process.env;

const RECEIVER_URL =
  'https://endpoint2.collection.us2.sumologic.com/receiver/v1/http/';

// tslint:disable-next-line no-non-null-assertion
const COLLECTOR_URL = new URL(SUMO_COLLECTOR_ID!, RECEIVER_URL).toString();

const transformActionForLogging = async (
  action: LoggedAction,
): Promise<LoggedAction> => {
  if (isActionOfType(action, 'UNHANDLED_ERROR_THROWN')) {
    const { message, source, line, column } = action.payload;
    if (source && line && column) {
      const { body: sourceMap } = await got(`${source}.map?branch=${BRANCH}`, {
        json: true,
      });
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
  const transformedActions = await bluebird
    .map(actions, transformActionForLogging)
    .map((action: LoggedAction) => ({
      ...action,
      timestamp: new Date(action.timestamp),
    }));

  await got.post(COLLECTOR_URL, {
    json: true,
    body: transformedActions,
    headers: {
      'X-Sumo-Category': `${BRANCH}/${COMMIT_ID}`,
      'X-Sumo-Host': 'Lambda',
    },
  });
}
