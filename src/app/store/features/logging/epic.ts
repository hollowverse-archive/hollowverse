import { Action, StoreState } from 'store/types';

import { Epic } from 'redux-observable';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/ignoreElements';
import 'rxjs/add/operator/withLatestFrom';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/merge';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/bufferWhen';
import 'rxjs/add/operator/bufferCount';
import 'rxjs/add/operator/share';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/observable/empty';

import {
  pageLoadSucceeded,
  pageLoadFailed,
  pageRedirected,
} from 'store/features/logging/actions';
import { LOCATION_CHANGE } from 'react-router-redux';
import { createPath } from 'history';
import { Observable } from 'rxjs/Observable';

const sendLog = async (actions: Action[]) => {
  const url = String(new URL(`/log?branch=${__BRANCH__}`, __BASE__));
  const data = actions.map(action => ({
    ...action,
    timestamp: new Date(),
    isServer: __IS_SERVER__,
  }));

  if (!__IS_SERVER__) {
    navigator.sendBeacon(url, JSON.stringify(data));
  } else {
    await fetch(url, {
      method: 'POST',
      body: JSON.stringify(data),

      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });
  }
};

const loggableActions: Array<Action['type']> = [
  'PAGE_LOAD_SUCCEEDED',
  'PAGE_LOAD_FAILED',
  'UNHANDLED_ERROR_THROWN',
  'SEARCH_RESULT_SELECTED',
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
        .payload.code;

      if (statusCode === 301 || statusCode === 302) {
        const to = setStatusCodeAction.payload.redirectTo;

        return pageRedirected({ from: url, to, statusCode });
      } else if (statusCode < 500) {
        return pageLoadSucceeded(url);
      }

      return pageLoadFailed(url);
    });

  const loggableActions$ = action$.filter(shouldActionBeLogged);
  let flushOnUnload$ = Observable.empty();

  if (!__IS_SERVER__) {
    flushOnUnload$ = Observable.fromEvent(window, 'unload');
  }

  // Send interesting actions to log endpoint
  const logInterestingEvents$ = loggableActions$
    .share()
    .bufferWhen(() => loggableActions$.bufferCount(10).merge(flushOnUnload$))
    .do(async actions => {
      try {
        await sendLog(actions);
      } catch (e) {
        console.error('Failed to send log event', e);
      }
    })
    .mergeMap(actions => actions)
    .ignoreElements();

  return logInterestingEvents$.merge(observePageLoad$);
};
