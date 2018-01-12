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
import 'rxjs/add/observable/empty';

import {
  pageLoadSucceeded,
  pageLoadFailed,
  pageRedirected,
} from 'store/features/logging/actions';
import { LOCATION_CHANGE } from 'react-router-redux';
import { createPath } from 'history';
import { Observable } from 'rxjs/Observable';
import { isEqual, pick } from 'lodash';
import { getUniversalUrl } from 'helpers/getUniversalUrl';

const getBestAvailableScheduler = async () => {
  if ('requestIdleCallback' in global) {
    return (await import('rxjs-requestidlecallback-scheduler')).idle;
  }

  return (await import('rxjs/scheduler/async')).async;
};

const logEndpointUrl = getUniversalUrl(`/log?branch=${__BRANCH__}`);

const sendLogs = async (actions: Action[]) => {
  try {
    if (actions.length === 0) {
      return;
    }
        
    const data = JSON.stringify(
      actions.map(action => ({
        ...action,
        timestamp: new Date(),
        isServer: __IS_SERVER__,
      })),
    );

    if (__IS_SERVER__) {
      await fetch(logEndpointUrl, {
        method: 'POST',
        body: data,

        headers: {
          Accept: 'application/json',
          'Content-Type': 'text/plain',
        },
      });
    } else if ('sendBeacon' in navigator) {
      // The most reliable way to send network requests on page unload is to use
      // `navigator.sendBeacon`.
      // Asynchronous requests using `fetch` or `XMLHttpRequest` that are sent on page unload
      // are ignored by the browser.
      // See https://developer.mozilla.org/en-US/docs/Web/API/Navigator/sendBeacon
      navigator.sendBeacon(logEndpointUrl, data);
    } else {
      // For browsers that do not support `sendBeacon`, a _synchronous_
      // HTTP request is the second best choice to ensure the request
      // is sent, although this will block the closing of page
      // until the request is done, so users may perceive the website
      // to be unresponsive.
      // Asynchronus requests are ignored by browsers.
      const request = new XMLHttpRequest();
      request.setRequestHeader('Accept', 'application/json');
      request.setRequestHeader('Content-Type', 'text/plain');
      request.open('POST', logEndpointUrl, false);
      request.send(data);
    }
  } catch (e) {
    console.error('Failed to send logs', e);
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

const locationCompareKeys = ['search', 'pathname', 'hash'];

export const loggingEpic: Epic<Action, StoreState> = action$ => {
  const observePageLoad$ = action$
    .ofType('SET_STATUS_CODE')
    .withLatestFrom(action$.ofType(LOCATION_CHANGE))
    // When on search page, do not log a page visit every time
    // the query in the URL changes, only look at the pathname instead
    //
    // This is to avoid sending too many logs while the user is typing
    // the search query, as the URL will keep changing to reflect the
    // search term: /search?query=t, /search?query=to, /search?query=tom
    .distinctUntilChanged((x, y) => {
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
        return areStatusCodeActionsEqual;
      }

      return (
        areStatusCodeActionsEqual &&
        isEqual(
          pick(locationChangePayloadX, locationCompareKeys),
          pick(locationChangePayloadY, locationCompareKeys),
        )
      );
    })
    .map(([setStatusCodeAction, locationChangeAction]) => {
      const url = createPath(
        (locationChangeAction as Action<typeof LOCATION_CHANGE>).payload,
      );
      const statusCodePayload = (setStatusCodeAction as Action<'SET_STATUS_CODE'>)
        .payload;

      if (statusCodePayload.code === 301 || statusCodePayload.code === 302) {
        const to = statusCodePayload.redirectTo;

        return pageRedirected({ from: url, to, statusCode: statusCodePayload.code });
      } else if (statusCodePayload.code < 500) {
        return pageLoadSucceeded(url);
      }

      return pageLoadFailed(url);
    });

  const loggableActions$ = action$.filter(shouldActionBeLogged);
  let flushOnUnload$;

  // tslint:disable-next-line:prefer-conditional-expression
  if (__IS_SERVER__) {
    flushOnUnload$ = Observable.empty();
  } else {
    flushOnUnload$ = Observable
      .fromEvent(window, 'pagehide') // `pagehide` is for Safari
      .merge(Observable.fromEvent(window, 'unload'));
  }

  const logOnUnload$ = loggableActions$.buffer(flushOnUnload$);
  const logOnIdle$ = loggableActions$.bufferCount(10);

  return Observable.fromPromise(getBestAvailableScheduler()).mergeMap(
    scheduler => {
      return logOnIdle$
        .subscribeOn(scheduler)
        .merge(logOnUnload$)
        .do(sendLogs)
        .mergeMap(actions => actions)
        .ignoreElements()
        .merge(observePageLoad$);
    },
  );
};
