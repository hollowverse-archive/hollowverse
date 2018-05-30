import { Action, LogBatch } from 'store/types';
import uuid from 'uuid/v4';
import { once } from 'lodash';

const logEndpointUrl = `/log?branch=${__BRANCH__}`;

export const getSessionId = once(() => {
  const existingId = localStorage.getItem('uid');
  if (existingId) {
    return existingId;
  }

  const newId = uuid();
  localStorage.setItem('uid', newId);

  return newId;
});

export const getUserAgent = () => navigator.userAgent;

export const sendLogs = async (batch: LogBatch<Action>) => {
  try {
    if (batch.actions.length === 0) {
      return;
    }

    const data = JSON.stringify(batch);

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
