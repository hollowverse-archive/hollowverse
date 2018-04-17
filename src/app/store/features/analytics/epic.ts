// tslint:disable no-unnecessary-type-assertion
import { LOCATION_CHANGE } from 'react-router-redux';

import { Action, StoreState } from 'store/types';

import { Epic } from 'redux-observable';

import 'rxjs/add/operator/skipWhile';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/ignoreElements';
import 'rxjs/add/operator/merge';

import { once } from 'lodash';
import { EpicDependencies } from 'store/createConfiguredStore';

const isServer = () => __IS_SERVER__;

export const analyticsEpic: Epic<Action, StoreState, EpicDependencies> = (
  action$,
  _,
  { getGoogleAnalyticsFunction },
) => {
  const initScript = once(async () => {
    const ga = await getGoogleAnalyticsFunction();
    ga('create', 'UA-110141722-1', 'auto');

    return ga;
  });

  return action$
    .ofType(LOCATION_CHANGE)
    .skipWhile(isServer)
    .do(async action => {
      try {
        const ga = await initScript();
        const { pathname } = (action as Action<typeof LOCATION_CHANGE>).payload;

        // Set currently active page
        ga('set', 'page', pathname);
      } catch (e) {
        // Do nothing
      }
    })
    .merge(
      action$
        .ofType('PAGE_LOAD_SUCCEEDED')
        .skipWhile(isServer)
        .do(async action => {
          try {
            const ga = await initScript();
            const path = (action as Action<'PAGE_LOAD_SUCCEEDED'>).payload;
            ga('send', 'pageview', path);
          } catch (e) {
            // Do nothing
          }
        }),
    )
    .ignoreElements();
};
