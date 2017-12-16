import { handleActions, isActionOfType } from 'store/helpers';
import { StoreState } from 'store/types';
import { createSelector } from 'reselect';

export const searchResultsReducer = handleActions<'searchResults'>(
  {
    SET_SEARCH_RESULTS: (state, action) => {
      if (isActionOfType(action, 'SET_SEARCH_RESULTS')) {
        return {
          isInProgress: false,
          hasError: false,
          value: action.payload.results,
        };
      }

      return state;
    },
    SET_SEARCH_ERROR: (state, action) => {
      if (isActionOfType(action, 'SET_SEARCH_ERROR')) {
        return {
          isInProgress: false,
          hasError: true,
          value: null,
        };
      }

      return state;
    },
    REQUEST_SEARCH_RESULTS: (state, action) => {
      if (isActionOfType(action, 'REQUEST_SEARCH_RESULTS')) {
        return {
          ...state, // Keep previous results while fetching new results
          isInProgress: true,
          hasError: false,
        };
      }

      return state;
    },
  },
  {
    hasError: false,
    isInProgress: false,
    value: null,
  },
);

const getRoutingState = (state: StoreState) => state.routing;

export const getSearchQuery = createSelector(getRoutingState, routing => {
  if (routing.location) {
    const params = new URLSearchParams(routing.location.search);

    return params.get('query');
  }

  return null;
});
