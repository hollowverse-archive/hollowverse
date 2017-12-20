import { StoreState } from 'store/types';
import { createSelector } from 'reselect';
import {
  isPendingResult,
  isOptimisticResult,
  isSuccessResult,
} from 'helpers/asyncResults';
import { getResolvedDataForKey } from 'store/features/data/selectors';

const getRoutingState = (state: StoreState) => state.routing;
const getSearchResults = (state: StoreState) =>
  state.resolvedData.searchResults;

export const getSearchQuery = createSelector(getRoutingState, routing => {
  if (routing.location) {
    const params = new URLSearchParams(routing.location.search);

    return params.get('query');
  }

  return null;
});

export const isNotablePersonPage = createSelector(
  getRoutingState,
  getResolvedDataForKey,
  ({ location }, getResolveData) => {
    const data = getResolveData('notablePersonQuery');
    if (
      location &&
      isSuccessResult(data) &&
      data.value &&
      data.value.notablePerson
    ) {
      return location.pathname === `/${data.value.notablePerson.slug}`;
    }

    return false;
  },
);

export const isSearchFocused = (state: StoreState) => state.isSearchFocused;

export const getSearchInputValue = createSelector(
  getSearchQuery,
  isNotablePersonPage,
  getResolvedDataForKey,
  isSearchFocused,
  (query, isNpPage, getResolveData, isFocused) => {
    const data = getResolveData('notablePersonQuery');
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
