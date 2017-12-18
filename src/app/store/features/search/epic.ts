import { push, LOCATION_CHANGE, replace } from 'react-router-redux';

import { Action, StoreState } from 'store/types';

import { Epic } from 'redux-observable';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/merge';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/takeUntil';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/fromPromise';

import { getSearchQuery } from 'store/features/search/selectors';
import { setSearchResults } from 'store/features/search/actions';

import { promiseToAsyncResult } from 'helpers/asyncResults';
import { isActionOfType } from 'store/helpers';

const isSearchPage = (action: Action) => {
  return (
    isActionOfType(action, LOCATION_CHANGE) &&
    action.payload.pathname === '/search'
  );
};

export const searchEpic: Epic<Action, StoreState> = (action$, store) => {
  const updateLoactionOnSearchRequest$ = action$
    .ofType('REQUEST_SEARCH_RESULTS')
    .mergeMap(action => {
      const { query } = (action as Action<'REQUEST_SEARCH_RESULTS'>).payload;
      const searchParams = new URLSearchParams();
      searchParams.append('query', query);
      const descriptor = {
        pathname: '/search',
        search: searchParams.toString(),
      };
      const location = store.getState().routing.location;

      return Observable.of(
        location && location.pathname === descriptor.pathname
          ? // This is to avoid things like
            // /search?query=t, /search?query=te, /search?query=tes, /search?query=test
            // filling the browser history stack instead of the actual
            // previous page
            replace(descriptor)
          : push(descriptor),
      );
    });

  const performSearchOnLocationChange$ = action$
    .ofType(LOCATION_CHANGE)
    .filter(isSearchPage)
    .mergeMap(_ =>
      Observable.fromPromise(import('vendor/algolia')).mergeMap(module => {
        const searchQuery = getSearchQuery(store.getState());
        const searchResults = promiseToAsyncResult(
          searchQuery
            ? module.notablePeople.search(searchQuery)
            : Promise.resolve(null),
        );

        return (
          Observable.fromPromise(searchResults)
            .map(setSearchResults)
            // Ignore pending search requests when a new request is dispatched
            .takeUntil(
              action$.ofType('REQUEST_SEARCH_RESULTS', LOCATION_CHANGE),
            )
        );
      }),
    );

  return updateLoactionOnSearchRequest$.merge(performSearchOnLocationChange$);
};
