import { routerReducer, RouterState } from 'react-router-redux';
import { StoreState, AppState, ReducerMap } from 'store/types';
import { handleAction } from 'store/helpers';
import { combineReducers, Reducer as GenericReducer } from 'redux';

const appReducers: ReducerMap<AppState> = {
  displayWarning: handleAction('toggleWarning'),
  userData: handleAction('setUserData'),
  notablePerson: handleAction('setNotablePerson'),
  createProfileUrlInputValue: handleAction('setCreateProfileUrlInputValue'),
  lastSearchTerm: handleAction('setLastSearchTerm'),
  isNavMenuOpen: handleAction('setIsNavMenuOpen'),
  error: handleAction('setError'),
  isLogoutPending: handleAction('setIsLogoutPending'),
  isLoginPending: handleAction('setIsLoginPending'),
  loginStatus: handleAction('setLoginStatus'),
  isSearchPending: handleAction('setIsSearchPending'),
  searchResults: handleAction('setSearchResults'),
  searchInputValue: handleAction('setSearchInputValue'),
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
