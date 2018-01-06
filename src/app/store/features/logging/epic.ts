import { Action, StoreState } from 'store/types';

import { Epic } from 'redux-observable';

import 'rxjs/add/operator/subscribeOn';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/ignoreElements';
import 'rxjs/add/observable/fromPromise';

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
          const url = new URL(`/log?branch=${__BRANCH__}`, __BASE__);

          await fetch(String(url), {
            method: 'POST',
            body: JSON.stringify(action.payload),

            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
          });
        } catch (e) {
          console.error('Failed to send log event', e);
        }
      })
      .ignoreElements(),
  );
};
