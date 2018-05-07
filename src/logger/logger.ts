// tslint:disable no-console

import bluebird from 'bluebird';
import { SourceMapConsumer } from 'source-map';
import got from 'got';

import { LoggedAction } from './types';
import { isActionOfType } from '../app/store/helpers';

const { BRANCH, COMMIT_ID, SPLUNK_COLLECTOR_TOKEN } = process.env;

const COLLECTOR_URL =
  'https://input-prd-p-kwnk36xd58jf.cloud.splunk.com:8088/services/collector/event';

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
      event: action,
      time: new Date(action.timestamp),
      host: 'Lambda',
      source: `hollowverse/${BRANCH}/${COMMIT_ID}`,
    }));

  await got.post(COLLECTOR_URL, {
    body: transformedActions.map(event => JSON.stringify(event)).join(''),
    headers: {
      Authorization: `Splunk ${SPLUNK_COLLECTOR_TOKEN}`,
    },
  });
}
