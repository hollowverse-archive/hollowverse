import { createActionCreator } from 'store/helpers';
import { push } from 'react-router-redux';

export const requestSearchResults = createActionCreator(
  'REQUEST_SEARCH_RESULTS',
);
export const setSearchIsFocused = createActionCreator('SET_SEARCH_IS_FOCUSED');

export const goToSearch = () => push('/search');
