import { tap, merge, ignoreElements } from 'rxjs/operators';
import { LOCATION_CHANGE } from 'react-router-redux';

import { Action, StoreState } from 'store/types';

import { Epic } from 'redux-observable';

import { once } from 'lodash';
import { EpicDependencies } from 'store/createConfiguredStore';

export const analyticsEpic: Epic<Action, StoreState, EpicDependencies> = (
  action$,
  _state$,
  { getGoogleAnalyticsFunction },
) => {
  const initScript = once(async () => {
    const ga = await getGoogleAnalyticsFunction();
    ga('create', 'UA-110141722-1', 'auto');

    return ga;
  });

  return action$.ofType<Action<typeof LOCATION_CHANGE>>(LOCATION_CHANGE).pipe(
    tap(async action => {
      try {
        const ga = await initScript();
        const { pathname } = action.payload;

        // Set currently active page
        ga('set', 'page', pathname);
      } catch (e) {
        // Do nothing
      }
    }),
    merge(
      action$.ofType<Action<'PAGE_LOAD_SUCCEEDED'>>('PAGE_LOAD_SUCCEEDED').pipe(
        tap(async action => {
          try {
            const ga = await initScript();
            const { path } = action.payload;
            ga('send', 'pageview', path);
          } catch (e) {
            // Do nothing
          }
        }),
      ),
    ),
    ignoreElements(),
  );
};
