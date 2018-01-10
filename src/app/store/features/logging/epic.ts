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
import 'rxjs/add/operator/subscribeOn';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/observable/empty';

import {
  pageLoadSucceeded,
  pageLoadFailed,
  pageRedirected,
} from 'store/features/logging/actions';
import { LOCATION_CHANGE } from 'react-router-redux';
import { createPath } from 'history';
import { Observable } from 'rxjs/Observable';

const getBestAvailableScheduler = async () => {
  if ('requestIdleCallback' in global) {
    return (await import('rxjs-requestidlecallback-scheduler')).idle;
  }

  return (await import('rxjs/scheduler/async')).async;
};

const sendLog = async (actions: Action[]) => {
  if (actions.length === 0) {
    return;
  }

  const url = String(new URL(`/log?branch=${__BRANCH__}`, __BASE__));

  const data = JSON.stringify(
    actions.map(action => ({
      ...action,
      timestamp: new Date(),
      isServer: __IS_SERVER__,
    })),
  );

  if (!__IS_SERVER__) {
    // The only reliable way to send network requests on page unload is to use
    // `navigator.sendBeacon`.
    // Asynchronous requests using `fetch` or `XMLHttpRequest` that are sent on page unload
    // are ignored by the browser.
    // See https://developer.mozilla.org/en-US/docs/Web/API/Navigator/sendBeacon
    navigator.sendBeacon(url, data);
  } else {
    await fetch(url, {
      method: 'POST',
      body: JSON.stringify(data),

      headers: {
        Accept: 'application/json',
        'Content-Type': 'text/plain',
      },
    });
  }
};

const loggableActions: Array<Action['type']> = [
  'PAGE_LOAD_SUCCEEDED',
  'PAGE_LOAD_FAILED',
  'PAGE_REDIRECTED',
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
    // Send batch of logs when either 10 log events
    // are accumulated, or the user navigates away
    .bufferWhen(() => loggableActions$.bufferCount(2).merge(flushOnUnload$))
    .do(async actions => {
      try {
        await sendLog(actions);
      } catch (e) {
        console.error('Failed to send log events', e);
      }
    })
    .mergeMap(actions => actions)
    .ignoreElements();

  return Observable.fromPromise(getBestAvailableScheduler()).mergeMap(
    scheduler => {
      return logInterestingEvents$
        .merge(observePageLoad$)
        .subscribeOn(scheduler);
    },
  );
};
