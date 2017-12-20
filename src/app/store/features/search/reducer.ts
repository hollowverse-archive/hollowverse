import { createReducerForStoreKey, handleAction } from 'store/helpers';

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
