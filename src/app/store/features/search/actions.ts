import { createActionCreator } from 'store/helpers';
import { push } from 'react-router-redux';

export const requestSearchResults = createActionCreator(
  'REQUEST_SEARCH_RESULTS',
);
export const setShouldFocusSearch = createActionCreator(
  'SET_SHOULD_FOCUS_SEARCH',
);

export const goToSearch = () => push('/search');
