import { LOCATION_CHANGE } from 'react-router-redux';
import { Action, StoreState } from 'store/types';

import { log } from './actions';

import { Epic } from 'redux-observable';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/merge';
import 'rxjs/add/operator/ignoreElements';

export const loggingEpic: Epic<Action, StoreState> = action$ => {
  const logLocationChange$ = action$.ofType(LOCATION_CHANGE).map(action => {
    const { payload } = action as Action<typeof LOCATION_CHANGE>;

    return log('PAGE_LOADED', {
      url: String(payload),
    });
  });

  const sendLogEvent$ = action$
    .ofType('LOG')
    .skipWhile(() => __IS_SERVER__)
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
    .ignoreElements();

  return logLocationChange$.merge(sendLogEvent$);
};
