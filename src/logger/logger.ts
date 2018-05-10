// tslint:disable no-console

import bluebird from 'bluebird';
import got from 'got';
import { globalAgent as globalHttpAgent } from 'http';
import { Agent as HttpsAgent } from 'https';
import { SourceMapConsumer } from 'source-map';
import { isActionOfType } from '../app/store/helpers';
import { LoggedAction } from './types';

const { BRANCH, COMMIT_ID, SPLUNK_COLLECTOR_TOKEN } = process.env;

const COLLECTOR_URL =
  'https://input-prd-p-kwnk36xd58jf.cloud.splunk.com:8088/services/collector/event';

const transformActionForLogging = async (
  action: LoggedAction,
): Promise<LoggedAction> => {
  if (isActionOfType(action, 'UNHANDLED_ERROR_THROWN')) {
    const { message, source, line, column } = action.payload;
    if (source && line && column) {
      const { body: sourceMap } = await got(`${source}.map`, {
        json: true,
        headers: {
          Cookie: `branch=${BRANCH}`,
        },
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
      host: 'HollowverseWebsite',
      source: `${BRANCH}/${COMMIT_ID}`,
    }));

  await got.post(COLLECTOR_URL, {
    body: transformedActions.map(event => JSON.stringify(event)).join(''),
    agent: {
      http: globalHttpAgent,
      https: new HttpsAgent({
        rejectUnauthorized: false,
      }),
    },
    headers: {
      Authorization: `Splunk ${SPLUNK_COLLECTOR_TOKEN}`,
    },
  });
}
