import { Action, StoreState } from 'store/types';

import { Epic } from 'redux-observable';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/ignoreElements';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/merge';

import { isActionOfType } from 'store/helpers';
import { isSuccessResult, isErrorResult } from 'helpers/asyncResults';
import {
  pageLoadFailed,
  pageLoadSucceeded,
  pageLoadStarted,
} from 'store/features/logging/actions';
import { LOCATION_CHANGE } from 'react-router-redux';
import { createPath } from 'history';
import { getRoutingState } from 'store/features/url/selectors';

const loadFetchPolyfill = async () => {
  if (!('fetch' in global)) {
    await import('whatwg-fetch');
  }
};

const sendLog = async (action: Action) => {
  const url = new URL(`/log?branch=${__BRANCH__}`, __BASE__);
  await loadFetchPolyfill();
  await fetch(String(url), {
    method: 'POST',
    body: JSON.stringify({
      timestamp: new Date(),
      // tslint:disable-next-line no-suspicious-comment
      // @FIXME: Type cast to work around TS issue
      ...(action.payload as any),
      isServer: __IS_SERVER__,
    }),

    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });
};

const loggableActions: Array<Action['type']> = [
  'PAGE_LOAD_STARTED',
  'PAGE_LOAD_FAILED',
  'PAGE_LOAD_SUCCEEDED',
];

const shouldActionBeLogged = (action: Action) =>
  loggableActions.includes(action.type);

export const loggingEpic: Epic<Action, StoreState> = (action$, store) => {
  const pageLoadStarted$ = action$.ofType(LOCATION_CHANGE).map(action => {
    const url = createPath((action as Action<typeof LOCATION_CHANGE>).payload);

    return pageLoadStarted(url);
  });

  // Observe notable person page requests, and the corresponding
  // data fetch result
  const notablePersonPage$ = action$
    .filter(action => {
      return (
        isActionOfType(action, 'SET_RESOLVED_DATA') &&
        action.payload.key === 'notablePersonQuery' &&
        (isSuccessResult(action.payload.data) ||
          isErrorResult(action.payload.data))
      );
    })
    .map(setResolvedDataAction => {
      const { data } = (setResolvedDataAction as Action<
        'SET_RESOLVED_DATA'
      >).payload;
      // tslint:disable-next-line:no-non-null-assertion
      const url = createPath(getRoutingState(store.getState()).location!);
      if (isSuccessResult(data)) {
        return pageLoadSucceeded(url);
      } else {
        return pageLoadFailed(url);
      }
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

  return logInterestingEvents$
    .merge(pageLoadStarted$)
    .merge(notablePersonPage$);
};
