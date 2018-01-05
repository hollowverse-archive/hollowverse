import { Action, StoreState } from 'store/types';

import { Epic } from 'redux-observable';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/merge';
import 'rxjs/add/operator/ignoreElements';
import 'rxjs/add/operator/subscribeOn';

import { Observable } from 'rxjs/Observable';
import { once } from 'lodash';

const getOptionalRequestIdleCallbackSchedulder = once(async () => {
  if ('requestIdleCallback' in global) {
    return (await import('rxjs-requestidlecallback-scheduler')).idle;
  }

  return (await import('rxjs/scheduler/async')).async;
});

export const loggingEpic: Epic<Action, StoreState> = action$ => {
  return Observable.fromPromise(
    getOptionalRequestIdleCallbackSchedulder(),
  ).mergeMap(scheduler =>
    action$
      .ofType('LOG')
      .subscribeOn(scheduler)
      .do(async action => {
        try {
          await fetch('/log', {
            method: 'POST',
            body: JSON.stringify(action.payload),

            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },

            // We need to include the `branch` and `env`
            // cookies to route the log request to the
            // logging endpoint that corresponds to this
            // branch.
            credentials: 'include',
          });
        } catch (e) {
          console.error('Failed to send log event', e);
        }
      })
      .ignoreElements(),
  );
};
