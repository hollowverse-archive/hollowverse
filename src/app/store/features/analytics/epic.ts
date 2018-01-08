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

        // Set currently active page
        ga('set', 'page', pathname);
      } catch (e) {
        // Do nothing
      }
    })
    .merge(
      action$.ofType('PAGE_LOAD_SUCCEEDED').do(async action => {
        try {
          await initScript();
          const path = (action as Action<'PAGE_LOAD_SUCCEEDED'>).payload;
          ga('send', 'pageview', path);
        } catch (e) {
          // Do nothing
        }
      }),
    )
    .ignoreElements();
};
