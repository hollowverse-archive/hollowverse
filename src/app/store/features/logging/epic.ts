import { merge, fromEvent as observableFromEvent } from 'rxjs';

import {
  buffer,
  ignoreElements,
  tap,
  bufferCount,
  map,
  distinctUntilChanged,
  withLatestFrom,
  filter,
} from 'rxjs/operators';

import { Action, StoreState, LoggedAction } from 'store/types';

import { Epic } from 'redux-observable';

import {
  pageLoadSucceeded,
  pageLoadFailed,
  pageRedirected,
} from 'store/features/logging/actions';
import { LOCATION_CHANGE } from 'react-router-redux';
import { createPath } from 'history';
import { isEqual, pick } from 'lodash';

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
  Action<'SET_STATUS_CODE'>,
  Action<typeof LOCATION_CHANGE>
]) => {
  const path = createPath(locationChangeAction.payload);
  const statusCodePayload = setStatusCodeAction.payload;

  if (statusCodePayload.code === 301 || statusCodePayload.code === 302) {
    const to = statusCodePayload.redirectTo;

    return pageRedirected({
      from: path,
      to,
      statusCode: statusCodePayload.code,
    });
  } else if (statusCodePayload.code === 500) {
    return pageLoadFailed({ path, error: statusCodePayload.error });
  }

  return pageLoadSucceeded({ path });
};

const comparePageLoadActions = (
  x: [Action<'SET_STATUS_CODE'>, Action<typeof LOCATION_CHANGE>],
  y: typeof x,
) => {
  const [setStatusCodeActionX, locationChangeActionX] = x;
  const [setStatusCodeActionY, locationChangeActionY] = y;
  const setStatusCodeActionPayloadX = setStatusCodeActionX.payload;
  const setStatusCodeActionPayloadY = setStatusCodeActionY.payload;
  const locationChangePayloadX = locationChangeActionX.payload;
  const locationChangePayloadY = locationChangeActionY.payload;
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
  _state$,
  { sendLogs, getSessionId, getUserAgent },
) => {
  const observePageLoad$ = action$.ofType('SET_STATUS_CODE').pipe(
    withLatestFrom(action$.ofType(LOCATION_CHANGE)),
    distinctUntilChanged<any>(comparePageLoadActions),
    map(mapPageLoadActions),
  );

  const createLoggableActionsObserver = () => {
    const loggableActions$ = action$.pipe(
      filter(shouldActionBeLogged),
      map(
        (action): LoggedAction => ({
          ...action,
          timestamp: new Date(),
        }),
      ),
    );

    const flushOnPageVisibilityChange$ = merge(
      // See https://www.igvita.com/2015/11/20/dont-lose-user-and-app-state-use-page-visibility/
      observableFromEvent(document, 'visibilitychange').pipe(
        filter(() => document.visibilityState === 'hidden'),
      ),
      observableFromEvent(window, 'pagehide'),
    );

    const logOnUnload$ = loggableActions$.pipe(
      buffer(flushOnPageVisibilityChange$),
    );
    const logOnIdle$ = loggableActions$.pipe(bufferCount(10));

    return merge(logOnIdle$, logOnUnload$).pipe(
      filter(actions => actions.length > 0),
      tap(async actions => {
        await sendLogs({
          actions,
          sessionId: getSessionId(),
          userAgent: getUserAgent(),
        });
      }),
      ignoreElements(),
    );
  };

  return merge(observePageLoad$, createLoggableActionsObserver());
};
