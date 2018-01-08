import { createActionCreator } from 'store/helpers';
import { push } from 'react-router-redux';

export const searchQueryChanged = createActionCreator('SEARCH_QUERY_CHANGED');
export const setShouldFocusSearch = createActionCreator(
  'SET_SHOULD_FOCUS_SEARCH',
);

export const goToSearch = () => push('/search');

export const setAlternativeSearchBoxText = createActionCreator(
  'SET_ALTERNATIVE_SEARCH_BOX_TEXT',
);
