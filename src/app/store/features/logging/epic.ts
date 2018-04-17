// tslint:disable no-unnecessary-type-assertion

import { Action, StoreState } from 'store/types';

import { Epic } from 'redux-observable';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/ignoreElements';
import 'rxjs/add/operator/withLatestFrom';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/merge';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/buffer';
import 'rxjs/add/operator/bufferCount';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/subscribeOn';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/observable/fromPromise';

import {
  pageLoadSucceeded,
  pageLoadFailed,
  pageRedirected,
} from 'store/features/logging/actions';
import { LOCATION_CHANGE } from 'react-router-redux';
import { createPath } from 'history';
import { Observable } from 'rxjs/Observable';
import { isEqual, pick } from 'lodash';

import { getBestAvailableScheduler } from './helpers';
import { EpicDependencies } from 'store/createConfiguredStore';

const loggableActions: Array<Action['type']> = [
  'PAGE_LOAD_SUCCEEDED',
  'PAGE_LOAD_FAILED',
  'PAGE_REDIRECTED',
  'UNHANDLED_ERROR_THROWN',
  'SEARCH_RESULT_SELECTED',
];

const shouldActionBeLogged = (action: Action) =>
  loggableActions.includes(action.type);

const locationCompareKeys = ['search', 'pathname', 'hash'];

const mapPageLoadActions = ([setStatusCodeAction, locationChangeAction]: [
  Action,
  Action
]) => {
  const url = createPath(
    (locationChangeAction as Action<typeof LOCATION_CHANGE>).payload,
  );
  const statusCodePayload = (setStatusCodeAction as Action<'SET_STATUS_CODE'>)
    .payload;

  if (statusCodePayload.code === 301 || statusCodePayload.code === 302) {
    const to = statusCodePayload.redirectTo;

    return pageRedirected({
      from: url,
      to,
      statusCode: statusCodePayload.code,
    });
  } else if (statusCodePayload.code < 500) {
    return pageLoadSucceeded(url);
  }

  return pageLoadFailed(url);
};

const comparePageLoadActions = (x: [Action, Action], y: typeof x) => {
  const [setStatusCodeActionX, locationChangeActionX] = x;
  const [setStatusCodeActionY, locationChangeActionY] = y;
  const setStatusCodeActionPayloadX = (setStatusCodeActionX as Action<
    'SET_STATUS_CODE'
  >).payload;
  const setStatusCodeActionPayloadY = (setStatusCodeActionY as Action<
    'SET_STATUS_CODE'
  >).payload;
  const locationChangePayloadX = (locationChangeActionX as Action<
    typeof LOCATION_CHANGE
  >).payload;
  const locationChangePayloadY = (locationChangeActionY as Action<
    typeof LOCATION_CHANGE
  >).payload;
  const areStatusCodeActionsEqual = isEqual(
    setStatusCodeActionPayloadX,
    setStatusCodeActionPayloadY,
  );

  if (
    locationChangePayloadX.pathname === '/search' &&
    locationChangePayloadY.pathname === '/search'
  ) {
    // When on search page, do not log a page visit every time
    // the query in the URL changes, only look at the pathname instead
    //
    // This is to avoid sending too many logs while the user is typing
    // the search query, as the URL will keep changing to reflect the
    // search term: /search?query=t, /search?query=to, /search?query=tom
    return areStatusCodeActionsEqual;
  }

  return (
    areStatusCodeActionsEqual &&
    isEqual(
      pick(locationChangePayloadX, locationCompareKeys),
      pick(locationChangePayloadY, locationCompareKeys),
    )
  );
};

export const loggingEpic: Epic<Action, StoreState, EpicDependencies> = (
  action$,
  _,
  { sendLogs },
) => {
  const observePageLoad$ = action$
    .ofType('SET_STATUS_CODE')
    .withLatestFrom(action$.ofType(LOCATION_CHANGE))
    .distinctUntilChanged(comparePageLoadActions)
    .map(mapPageLoadActions);

  const createLoggableActionsObserver = () => {
    const loggableActions$ = action$.filter(shouldActionBeLogged);
    if (__IS_SERVER__) {
      // Logs should be sent immediately on the server because a new store instance is created
      // for each request so we can't `buffer` log events between request, and we can't "flush"
      // when the request is being sent because the store is not aware of the HTTP request
      // lifecycle
      return loggableActions$
        .map(action => [action])
        .do(sendLogs)
        .ignoreElements();
    } else {
      const flushOnUnload$ = Observable.fromEvent(window, 'pagehide') // `pagehide` is for Safari
        .merge(Observable.fromEvent(window, 'unload'));

      const logOnUnload$ = loggableActions$.buffer(flushOnUnload$);
      const logOnIdle$ = loggableActions$.bufferCount(10);

      return Observable.fromPromise(getBestAvailableScheduler()).mergeMap(
        scheduler => {
          return logOnIdle$
            .subscribeOn(scheduler)
            .merge(logOnUnload$)
            .do(sendLogs)
            .mergeMap(actions => actions)
            .ignoreElements();
        },
      );
    }
  };

  return observePageLoad$.merge(createLoggableActionsObserver());
};
