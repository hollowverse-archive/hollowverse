import { Action } from 'store/types';
import Cookie from 'js-cookie';
import uuid from 'uuid/v4';
import { once } from 'lodash';

const logEndpointUrl = `/log?branch=${__BRANCH__}`;

/**
 * We try to use the Google Analytics "Client ID" to associate
 * logs with the same GA user, otherwise we generate a new random
 * ID.
 * Note: this function should not be invoked immediately to give
 * enough time for Google Analytics script to load (since it's loaded lazily).
 * @see https://developers.google.com/analytics/devguides/collection/analyticsjs/cookies-user-id
 */
const getSessionId = once(() => {
  const existingId = localStorage.getItem('uid') || Cookie.get('_ga');
  if (existingId) {
    return existingId;
  }

  const newId = uuid();
  localStorage.setItem('uid', newId);

  return newId;
});

export const sendLogs = async (actions: Action[]) => {
  try {
    if (actions.length === 0) {
      return;
    }

    const data = JSON.stringify(
      actions.map(action => ({
        ...action,
        timestamp: new Date(),
        sessionId: getSessionId(),
      })),
    );

    if ('sendBeacon' in navigator) {
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
      // Asynchronous requests are ignored by browsers.
      const request = new XMLHttpRequest();
      request.open('POST', logEndpointUrl, false);
      request.setRequestHeader('Accept', 'application/json');
      request.setRequestHeader('Content-Type', 'text/plain');
      request.send(data);
    }
  } catch (e) {
    console.error('Failed to send logs', e);
  }
};
