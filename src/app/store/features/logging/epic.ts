import { Action, StoreState } from 'store/types';

import { Epic } from 'redux-observable';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/ignoreElements';
import 'rxjs/add/operator/withLatestFrom';
import 'rxjs/add/operator/takeWhile';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/merge';

import { loadFetchPolyfill } from 'helpers/loadPolyfill';
import {
  pageLoadSucceeded,
  pageLoadFailed,
} from 'store/features/logging/actions';
import { LOCATION_CHANGE } from 'react-router-redux';
import { createPath } from 'history';

const sendLog = async (action: Action) => {
  const url = new URL(`/log?branch=${__BRANCH__}`, __BASE__);
  await loadFetchPolyfill();
  await fetch(String(url), {
    method: 'POST',
    body: JSON.stringify({
      ...action,
      timestamp: new Date(),
      isServer: __IS_SERVER__,
    }),

    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });
};

const loggableActions: Array<Action['type']> = [
  'PAGE_LOAD_SUCCEEDED',
  'PAGE_LOAD_FAILED',
];

const shouldActionBeLogged = (action: Action) =>
  loggableActions.includes(action.type);

export const loggingEpic: Epic<Action, StoreState> = action$ => {
  const observePageLoad$ = action$
    .ofType('SET_STATUS_CODE')
    .withLatestFrom(action$.ofType(LOCATION_CHANGE))
    .map(([setStatusCodeAction, locationChangeAction]) => {
      const url = createPath(
        (locationChangeAction as Action<typeof LOCATION_CHANGE>).payload,
      );
      const statusCode = (setStatusCodeAction as Action<'SET_STATUS_CODE'>)
        .payload;

      if (statusCode < 500) {
        return pageLoadSucceeded(url);
      }

      return pageLoadFailed(url);
    });

  // Send interesting actions to log endpoint
  const logInterestingEvents$ = action$
    .filter(shouldActionBeLogged)
    .do(async action => {
      try {
        await sendLog(action);
      } catch (e) {
        console.error('Failed to send log event', e);
      }
    })
    .ignoreElements();

  return logInterestingEvents$.merge(observePageLoad$);
};
