/*
REDUX ACTION CREATORS

This file contains Redux action creators as well as the initial state object.

We've decided to put the initial state object here for convenience because adding an
action usually means adding a new property to the state.
*/
import {stringEnum} from '../utils/utils'
import {IAlgoliaSearchResults} from '../vendor/algolia'
import {HvError} from '../typeDefinitions'
import {handleAction} from './utils'
import {push} from 'react-router-redux'

// This interface defines types of the entire state object of Hollowverse
export interface IGeneralState {
  searchInputValue: string,
  searchResults: IAlgoliaSearchResults | undefined,
  isSearchPending: boolean,
  loginStatus: facebookSdk.LoginStatus,
  isLoginPending: boolean,
  isLogoutPending: boolean,
  error: HvError,
  isNavMenuOpen: boolean,
  lastSearchTerm: string,
  createProfileUrlInputValue: string
}

// Initialize the default state object
export const initialGeneralState: IGeneralState = {
  searchInputValue: '',
  searchResults: undefined,
  isSearchPending: false,
  loginStatus: 'unknown',
  isLoginPending: false,
  isLogoutPending: false,
  error: undefined,
  isNavMenuOpen: false,
  lastSearchTerm: '',
  createProfileUrlInputValue: '',
}

// These are all the actions that can be triggered from within the Hollowverse application
export const actions = {
  navigateToSearch: (payload: string) => {
    return push({
      pathname: '/',
      search: payload,
    })
  },
  setSearchInputValue: (payload: string) => ({type: 'setSearchInputValue', payload}),
  setIsSearchPending: (payload: boolean) => ({type: 'setIsSearchPending', payload}),
  setIsLoginPending: (payload: boolean) => ({type: 'setIsLoginPending', payload}),
  setIsLogoutPending: (payload: boolean) => ({type: 'setIsLogoutPending', payload}),
  setSearchError: (payload: string) => ({type: 'setSearchError', payload}),
  setSearchResults: (payload: IAlgoliaSearchResults | undefined) => ({type: 'setSearchResults', payload}),
  setLoginStatus: (payload: facebookSdk.LoginStatus | undefined) => ({type: 'setLoginStatus', payload}),
  setError: (payload: HvError) => ({type: 'setError', payload}),
  setIsNavMenuOpen: (payload: boolean) => ({type: 'setIsNavMenuOpen', payload}),
  setLastSearchTerm: (payload: string) => ({type: 'setLastSearchTerm', payload}),
  requestSearchResults: (payload: string) => ({type: 'requestSearchResults', payload}),
  requestLogin: () => ({type: 'requestLogin'}),
  requestLogout: () => ({type: 'requestLogout'}),
  requestUpdateLoginStatus: () => ({type: 'requestUpdateLoginStatus'}),
  setCreateProfileUrlInputValue: (payload: string) => ({type: 'setCreateProfileUrlInputValue', payload}),
}

export type ActionTypes = keyof typeof actions
export const ActionTypes = stringEnum(Object.keys(actions)) as {[name in ActionTypes]: ActionTypes}

export const actionHandlers = {
  [ActionTypes.setSearchInputValue]: handleAction<string>('searchInputValue'),
  [ActionTypes.setSearchResults]: handleAction<IAlgoliaSearchResults | undefined>('searchResults'),
  [ActionTypes.setIsSearchPending]: handleAction<boolean>('isSearchPending'),
  [ActionTypes.setLoginStatus]: handleAction<facebookSdk.LoginStatus>('loginStatus'),
  [ActionTypes.setIsLoginPending]: handleAction<boolean>('isLoginPending'),
  [ActionTypes.setIsLogoutPending]: handleAction<boolean>('isLogoutPending'),
  [ActionTypes.setError]: handleAction<HvError>('error'),
  [ActionTypes.setIsNavMenuOpen]: handleAction<boolean>('isNavMenuOpen'),
  [ActionTypes.setLastSearchTerm]: handleAction<string>('lastSearchTerm'),
  [ActionTypes.setCreateProfileUrlInputValue]: handleAction<string>('createProfileUrlInputValue'),
}
