import { push, LOCATION_CHANGE } from 'react-router-redux';

import { Action, StoreState } from 'store/types';

import { Epic } from 'redux-observable';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/merge';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/takeUntil';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/fromPromise';

import { notablePeople } from 'vendor/algolia';

import { getSearchQuery } from 'store/features/search/selectors';
import {
  setSearchResults,
  setSearchError,
} from 'store/features/search/actions';

export const searchEpic: Epic<Action, StoreState> = (action$, store) => {
  return action$
    .ofType('REQUEST_SEARCH_RESULTS')
    .mergeMap(action => {
      const { query } = (action as Action<'REQUEST_SEARCH_RESULTS'>).payload;
      const searchParams = new URLSearchParams();
      searchParams.append('query', query);

      return Observable.of(
        push({
          pathname: '/search',
          search: searchParams.toString(),
        }),
      );
    })
    .merge(
      action$
        .ofType(LOCATION_CHANGE)
        .filter(
          action =>
            (action as Action<typeof LOCATION_CHANGE>).payload.pathname ===
            '/search',
        )
        .mergeMap(_ => {
          return Observable.of(getSearchQuery(store.getState()))
            .filter(Boolean)
            .mergeMap(query =>
              Observable.fromPromise(notablePeople.search(query as string))
                .map(results => setSearchResults({ results }))
                .catch(error => Observable.of(setSearchError({ error })))
                // Ignore pending search requests when a new request is dispatched
                .takeUntil(
                  action$.ofType('REQUEST_SEARCH_RESULTS', LOCATION_CHANGE),
                ),
            );
        }),
    );
};
