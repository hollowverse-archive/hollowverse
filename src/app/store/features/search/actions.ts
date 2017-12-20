import { createActionCreator } from 'store/helpers';

export const requestSearchResults = createActionCreator(
  'REQUEST_SEARCH_RESULTS',
);
export const setSearchIsFocused = createActionCreator('SET_SEARCH_IS_FOCUSED');
