import { LOCATION_CHANGE } from 'react-router-redux';

import { Action, StoreState } from 'store/types';

import { Epic } from 'redux-observable';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/merge';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/takeUntil';
import 'rxjs/add/operator/startWith';
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

/**
 * Listens for URL changes and performs search
 * if the URL matches the search page
 */
export const performSearchEpic: Epic<Action, StoreState> = (action$, store) => {
  return action$
    .ofType(LOCATION_CHANGE)
    .filter(isSearchPage)
    .startWith({})
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
};
