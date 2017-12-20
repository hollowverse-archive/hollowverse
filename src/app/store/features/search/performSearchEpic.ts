import { LOCATION_CHANGE } from 'react-router-redux';

import { Action, StoreState } from 'store/types';

import { Epic } from 'redux-observable';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/takeUntil';
import 'rxjs/add/operator/takeWhile';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/observable/fromPromise';

import { getSearchQuery } from 'store/features/search/selectors';
import { setSearchResults } from 'store/features/search/actions';

import { promiseToAsyncResult } from 'helpers/asyncResults';
import { AlgoliaResponse } from 'algoliasearch';

const isSearchPage = (state: StoreState) => {
  return (
    !!state.routing.location && state.routing.location.pathname === '/search'
  );
};

/**
 * Listens for URL changes and performs search
 * if the URL matches the search page
 */
export const performSearchEpic: Epic<Action, StoreState> = (action$, store) => {
  return action$
    .ofType(LOCATION_CHANGE)
    .startWith({})
    .takeWhile(() => isSearchPage(store.getState()))
    .mergeMap(_ => {
      const searchQuery = getSearchQuery(store.getState());
      let results: Promise<null | AlgoliaResponse> = Promise.resolve(null);

      if (searchQuery) {
        results = import('vendor/algolia').then(({ notablePeople }) =>
          notablePeople.search(searchQuery),
        );
      }

      return (
        Observable.fromPromise(promiseToAsyncResult(results))
          .map(setSearchResults)
          // Ignore pending search requests when a new request is dispatched
          .takeUntil(action$.ofType('REQUEST_SEARCH_RESULTS', LOCATION_CHANGE))
      );
    });
};
