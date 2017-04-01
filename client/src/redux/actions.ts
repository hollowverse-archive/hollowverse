import {stringEnum} from '../utils/utils'
import {IAlgoliaSearchResults} from '../vendor/algolia'
import {HvError} from '../typeDefinitions'
import {createActionCreator, createActionCreatorWithNoPayload, handleAction} from './utils'
import {nonStandardActions} from './nonStandardActions'
import LoginStatus = facebookSdk.LoginStatus

export interface IGeneralState {
  searchInputValue: string,
  searchResults: IAlgoliaSearchResults | undefined,
  isSearchPending: boolean,
  loginStatus: LoginStatus,
  isLoginPending: boolean,
  isLogoutPending: boolean,
  error: HvError,
  isNavMenuOpen: boolean,
  lastSearchTerm: string,
  createProfileUrlInputValue: string
}

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
  createProfileUrlInputValue: ''
}

export const actions = {
  ...nonStandardActions,
  setSearchInputValue: createActionCreator<string>('setSearchInputValue'),
  setIsSearchPending: createActionCreator<boolean>('setIsSearchPending'),
  setIsLoginPending: createActionCreator<boolean>('setIsLoginPending'),
  setIsLogoutPending: createActionCreator<boolean>('setIsLogoutPending'),
  setSearchError: createActionCreator<string>('setSearchError'),
  setSearchResults: createActionCreator<IAlgoliaSearchResults | undefined>('setSearchResults'),
  setLoginStatus: createActionCreator<facebookSdk.LoginStatus | undefined>('setLoginStatus'),
  setError: createActionCreator<HvError>('setError'),
  setIsNavMenuOpen: createActionCreator<boolean>('setIsNavMenuOpen'),
  setLastSearchTerm: createActionCreator<string>('setLastSearchTerm'),
  requestSearchResults: createActionCreator<string>('requestSearchResults'),
  requestLogin: createActionCreatorWithNoPayload('requestLogin'),
  requestLogout: createActionCreatorWithNoPayload('requestLogout'),
  requestUpdateLoginStatus: createActionCreatorWithNoPayload('requestUpdateLoginStatus'),
  setCreateProfileUrlInputValue: createActionCreator<string>('setCreateProfileUrlInputValue'),
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
