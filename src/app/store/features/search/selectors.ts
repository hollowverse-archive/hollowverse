import { StoreState } from 'store/types';
import { createSelector } from 'reselect';
import { isPendingResult, isOptimisticResult } from 'helpers/asyncResults';
import { getRoutingState, isSearchPage } from 'store/features/url/selectors';

const getSearchResults = (state: StoreState) =>
  state.resolvedData.searchResults;

export const getSearchQuery = createSelector(
  getRoutingState,
  ({ location }) => {
    if (location) {
      const params = new URLSearchParams(location.search);

      return params.get('query');
    }

    return null;
  },
);

export const shouldFocusSearch = (state: StoreState) => state.shouldFocusSearch;

export const getAlternativeSearchBoxText = (state: StoreState) =>
  state.alternativeSearchBoxText;

export const getSearchInputValue = createSelector(
  getSearchQuery,
  isSearchPage,
  getAlternativeSearchBoxText,
  shouldFocusSearch,
  (query, isSearch, alternativeText, isFocused) => {
    if (!isFocused && !isSearch && alternativeText !== null) {
      return alternativeText;
    }

    return query || '';
  },
);

export const isSearchInProgress = createSelector(
  getSearchResults,
  results => isPendingResult(results) || isOptimisticResult(results),
);
