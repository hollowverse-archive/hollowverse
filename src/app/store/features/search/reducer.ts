import { createReducerForStoreKey, handleAction } from 'store/helpers';

export const searchResultsReducer = createReducerForStoreKey<'searchResults'>(
  {
    SET_SEARCH_RESULTS: handleAction<'searchResults'>('SET_SEARCH_RESULTS'),
    REQUEST_SEARCH_RESULTS: state => ({
      ...state,
      hasError: false,
      isInProgress: true,
    }),
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
    SET_LAST_SEARCH_MATCH: handleAction<'lastSearchMatch'>(
      'SET_LAST_SEARCH_MATCH',
    ),
  },
  null,
);
