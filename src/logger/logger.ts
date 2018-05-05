// tslint:disable no-console
import { DateTime } from 'luxon';
import bluebird from 'bluebird';
import { SourceMapConsumer } from 'source-map';
import got from 'got';
import { URL } from 'url';

import { LoggedAction } from './types';
import { isActionOfType, isErrorType } from '../app/store/helpers';

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

export const convertObjectsToLines = (
  additionalProps?: Record<string, any>,
) => (action: LoggedAction) => {
  const { timestamp, type, ...rest } = action;

  const normalizedDate = DateTime.fromISO(timestamp, { zone: 'UTC' });

  const pairs = Object.entries({
    ...additionalProps,
    ...(typeof rest.payload === 'object' ? rest.payload : rest),
  }).map(
    ([key, value]) =>
      `${key}=${typeof value === 'string' ? `"${value}"` : value}`,
  );

  const level = isErrorType(type) ? 'ERROR' : 'INFO';

  return `${normalizedDate} [${type}] ${level} ${pairs.join(', ')}`;
};

export async function log(actions: LoggedAction[]) {
  const lines = await bluebird
    .map(actions, transformActionForLogging)
    .map(convertObjectsToLines({ branch: BRANCH, commit: COMMIT_ID }));

  await got.post(COLLECTOR_URL, {
    body: lines.join('\n'),
    headers: {
      'Content-Type': 'text/plain',
      'X-Sumo-Category': 'hollowverse.com',
      'X-Sumo-Host': 'Lambda',
    },
  });
}
