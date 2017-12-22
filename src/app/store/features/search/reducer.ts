import { createReducerForStoreKey, handleAction } from 'store/helpers';

export const isSearchFocusedReducer = createReducerForStoreKey<
  'shouldFocusSearch'
>(
  {
    SET_SHOULD_FOCUS_SEARCH: handleAction<'shouldFocusSearch'>(
      'SET_SHOULD_FOCUS_SEARCH',
    ),
  },
  false,
);
