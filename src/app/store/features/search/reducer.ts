import { createReducerForStoreKey, handleAction } from 'store/helpers';

export const searchResultsReducer = createReducerForStoreKey<'searchResults'>(
  {
    SET_SEARCH_RESULTS: handleAction('SET_SEARCH_RESULTS'),
    REQUEST_SEARCH_RESULTS: handleAction('REQUEST_SEARCH_RESULTS'),
  },
  {
    hasError: false,
    isInProgress: false,
    value: null,
  },
);

export const lastSearchMatchReducer = createReducerForStoreKey<
  'lastSearchMatch'
>(
  {
    SET_LAST_SEARCH_MATCH: handleAction('SET_LAST_SEARCH_MATCH'),
  },
  null,
);
