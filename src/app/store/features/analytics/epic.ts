import { LOCATION_CHANGE } from 'react-router-redux';

import { Action, StoreState } from 'store/types';

import { Epic } from 'redux-observable';

import 'rxjs/add/operator/skipWhile';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/ignoreElements';

import { importGlobalScript } from 'helpers/importGlobalScript';
import { once } from 'lodash';

const GA_URL = 'https://www.google-analytics.com/analytics.js';

const initScript = once(async () => {
  await importGlobalScript(GA_URL);
  ga('create', 'UA-110141722-1', 'auto');
});

const isServer = () => __IS_SERVER__;

export const analyticsEpic: Epic<Action, StoreState> = action$ => {
  return action$
    .ofType(LOCATION_CHANGE)
    .skipWhile(isServer)
    .do(async action => {
      try {
        await initScript();
        const { pathname } = (action as Action<typeof LOCATION_CHANGE>).payload;
        ga('set', 'page', pathname);
        ga('send', 'pageview');
      } catch (e) {
        // Do nothing
      }
    })
    .ignoreElements();
};
