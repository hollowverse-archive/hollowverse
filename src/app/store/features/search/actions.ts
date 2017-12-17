import { createActionCreator } from 'store/helpers';

export const requestSearchResults = createActionCreator(
  'REQUEST_SEARCH_RESULTS',
);
export const setSearchResults = createActionCreator('SET_SEARCH_RESULTS');
export const setLastSearchMatch = createActionCreator('SET_LAST_SEARCH_MATCH');
