import { StoreState } from 'store/types';
import { createSelector } from 'reselect';
import { isPendingResult, isOptimisticResult } from 'helpers/asyncResults';

const getRoutingState = (state: StoreState) => state.routing;
const getSearchResults = (state: StoreState) => state.searchResults;

export const getSearchQuery = createSelector(getRoutingState, routing => {
  if (routing.location) {
    const params = new URLSearchParams(routing.location.search);

    return params.get('query');
  }

  return null;
});

export const isSearchInProgress = createSelector(
  getSearchResults,
  results => isPendingResult(results) || isOptimisticResult(results),
);
