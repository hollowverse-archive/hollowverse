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

export const isSearchFocusedReducer = createReducerForStoreKey<
  'isSearchFocused'
>(
  {
    SET_SEARCH_IS_FOCUSED: handleAction<'isSearchFocused'>(
      'SET_SEARCH_IS_FOCUSED',
    ),
  },
  false,
);
