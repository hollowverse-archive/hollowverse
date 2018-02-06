import { createActionCreator } from 'store/helpers';

export const searchQueryChanged = createActionCreator('SEARCH_QUERY_CHANGED');
export const setShouldFocusSearch = createActionCreator(
  'SET_SHOULD_FOCUS_SEARCH',
);

export const goToSearch = createActionCreator('GO_TO_SEARCH');

export const setAlternativeSearchBoxText = createActionCreator(
  'SET_ALTERNATIVE_SEARCH_BOX_TEXT',
);
