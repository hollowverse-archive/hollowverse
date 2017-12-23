import { push, replace } from 'react-router-redux';

import { Action, StoreState } from 'store/types';

import { Epic } from 'redux-observable';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mapTo';
import 'rxjs/add/operator/merge';
import 'rxjs/add/operator/skipWhile';
import 'rxjs/add/operator/startWith';
import { setShouldFocusSearch } from 'store/features/search/actions';

const isSearchPage = (state: StoreState) => {
  return (
    !!state.routing.location && state.routing.location.pathname === '/search'
  );
};

/**
 * Listens for actions requesting search results and
 * updates the URL address on the search page to
 * reflect the search query.
 * @example `{ type: 'SEARCH_QUERY_CHANGED', query: 'Tom Ha' }` => '/search?query=Tom+Ha'
 */
export const updateUrlEpic: Epic<Action, StoreState> = (action$, store) => {
  return action$
    .ofType('SEARCH_QUERY_CHANGED')
    .startWith(setShouldFocusSearch(true))
    .map(action => {
      const { query } = (action as Action<'SEARCH_QUERY_CHANGED'>).payload;
      const searchParams = new URLSearchParams();
      searchParams.append('query', query);
      const descriptor = {
        pathname: '/search',
        search: searchParams.toString(),
      };

      const location = store.getState().routing.location;

      return location && location.pathname === descriptor.pathname
        ? // This is to avoid things like
          // /search?query=t, /search?query=te, /search?query=tes, /search?query=test
          // filling the browser history stack instead of the actual
          // previous page
          replace(descriptor)
        : push(descriptor);
    })
    .merge(
      action$
        .ofType('SET_SHOULD_FOCUS_SEARCH')
        .skipWhile(() => isSearchPage(store.getState()))
        .mapTo(push('/search')),
    );
};
