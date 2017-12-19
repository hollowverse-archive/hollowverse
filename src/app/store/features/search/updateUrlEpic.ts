import { push, replace } from 'react-router-redux';

import { Action, StoreState } from 'store/types';

import { Epic } from 'redux-observable';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/observable/of';

/**
 * Listens for actions requesting search results and
 * updates the URL address on the search page to
 * reflect the search query.
 * @example `{ type: 'REQUEST_SEARCH_RESULTS', query: 'Tom Ha' }` => '/search?query=Tom+Ha'
 */
export const updateUrlEpic: Epic<Action, StoreState> = (action$, store) => {
  return action$.ofType('REQUEST_SEARCH_RESULTS').mergeMap(action => {
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
};
