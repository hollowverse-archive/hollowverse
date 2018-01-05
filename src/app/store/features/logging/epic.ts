import { Action, StoreState } from 'store/types';

import { Epic } from 'redux-observable';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/merge';
import 'rxjs/add/operator/ignoreElements';

export const loggingEpic: Epic<Action, StoreState> = action$ => {
  return action$
    .ofType('LOG')
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
};
