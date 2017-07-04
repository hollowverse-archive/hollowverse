//
// REDUX SELECTORS
//
// This file just contains Redux selectors.
//
// Redux selectors help derive values from the `state` dynamically. As a best practice, if a value can be computed
// through a selector, it shouldn't be stored in the state.
//
import { State } from './reducers';

export function getNumberOfSearchHits(state: State) {
  if (state.searchResults !== null) {
    return state.searchResults.hits.length;
  } else {
    return 0;
  }
}

export function getUserIsLoggedIn(state: State) {
  return state.loginStatus === 'connected';
}

export function showGlobalSpinner(state: State) {
  return state.isLogoutPending || state.isLoginPending;
}

export function hasResults(state: State) {
  return (
    (state.searchResults &&
      state.searchResults.hits &&
      state.searchResults.hits.length > 0) ||
    false
  );
}
