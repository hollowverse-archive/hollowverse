import {State} from './redux.reducers'

export function getNumberOfSearchHits(state: State) {
  if (typeof state.searchResults !== 'undefined') {
    return state.searchResults.hits.length
  } else {
    return 0
  }
}

export function getUserIsLoggedIn(state: State) {
  return state.loginStatus === 'connected'
}

export function showGlobalSpinner(state: State) {
  return (
    state.isLogoutPending ||
    state.isLoginPending
  )
}

export function hasResults(state: State) {
  return state.searchResults && state.searchResults.hits && state.searchResults.hits.length > 0 || false
}
