import { routerReducer, RouterState } from 'react-router-redux';
import { StoreState, AppState, ReducerMap } from 'store/types';
import { handleAction } from 'store/helpers';
import { combineReducers, Reducer as GenericReducer } from 'redux';

const appReducers: ReducerMap<AppState> = {
  displayWarning: handleAction<'displayWarning'>('toggleWarning', false),
  userData: handleAction<'userData'>('setUserData', null),
  notablePerson: handleAction<'notablePerson'>('setNotablePerson', null),
  createProfileUrlInputValue: handleAction<'createProfileUrlInputValue'>(
    'setCreateProfileUrlInputValue',
    '',
  ),
  lastSearchTerm: handleAction<'lastSearchTerm'>('setLastSearchTerm', ''),
  isNavMenuOpen: handleAction<'isNavMenuOpen'>('setIsNavMenuOpen', false),
  error: handleAction<'error'>('setError', null),
  isLogoutPending: handleAction<'isLogoutPending'>('setIsLogoutPending', false),
  isLoginPending: handleAction<'isLoginPending'>('setIsLoginPending', false),
  loginStatus: handleAction<'loginStatus'>('setLoginStatus', 'unknown'),
  isSearchPending: handleAction<'isSearchPending'>('setIsSearchPending', false),
  searchResults: handleAction<'searchResults'>('setSearchResults', null),
  searchInputValue: handleAction<'searchInputValue'>('setSearchInputValue', ''),
};

/**
 * This is the root reducer of the app.
 * It includes Hollowverse `appReducer` as well as other reducers
 * that may be required by external modules.
 */
export const reducer = combineReducers<StoreState>({
  ...appReducers,
  routing: routerReducer as GenericReducer<RouterState>,
});
