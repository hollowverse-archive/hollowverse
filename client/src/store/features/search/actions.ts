import { createActionCreator } from '../../helpers';

export const setSearchInputValue = createActionCreator('setSearchInputValue');
export const requestSearchResults = createActionCreator('requestSearchResults');
export const setIsSearchPending = createActionCreator('setIsSearchPending');
export const setSearchError = createActionCreator('setSearchError');
export const setSearchResults = createActionCreator('setSearchResults');
export const setLastSearchTerm = createActionCreator('setLastSearchTerm');
export const navigateToSearch = createActionCreator('navigateToSearch');
