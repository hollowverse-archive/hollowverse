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

export const alternativeSearchBoxTextReducer = createReducerForStoreKey<
  'alternativeSearchBoxText'
>(
  {
    SET_ALTERNATIVE_SEARCH_BOX_TEXT: handleAction<'alternativeSearchBoxText'>(
      'SET_ALTERNATIVE_SEARCH_BOX_TEXT',
    ),
  },
  null,
);
