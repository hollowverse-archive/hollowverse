import { StoreState } from 'store/types';
import { createSelector } from 'reselect';
import {
  isPendingResult,
  isOptimisticResult,
  isSuccessResult,
} from 'helpers/asyncResults';
import { getResolvedDataForKey } from 'store/features/data/selectors';
import {
  getRoutingState,
  isNotablePersonPage,
} from 'store/features/url/selectors';

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

export const getSearchInputValue = createSelector(
  getSearchQuery,
  isNotablePersonPage,
  getResolvedDataForKey,
  shouldFocusSearch,
  (query, isNpPage, getResolvedData, isFocused) => {
    const data = getResolvedData('notablePersonQuery');
    if (
      !isFocused &&
      isNpPage &&
      isSuccessResult(data) &&
      data.value &&
      data.value.notablePerson
    ) {
      return data.value.notablePerson.name;
    }

    return query || undefined;
  },
);

export const isSearchInProgress = createSelector(
  getSearchResults,
  results => isPendingResult(results) || isOptimisticResult(results),
);
