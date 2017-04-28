import {Action} from './utils'
import {Reducer} from 'redux'
import {routerReducer, RouterState} from 'react-router-redux'
import {actionHandlers} from './actions'
import LoginStatus = facebookSdk.LoginStatus
import {IAlgoliaSearchResults} from '../vendor/algolia'
import {HvError} from '../typeDefinitions'

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

interface IState extends IGeneralState {
  routing: RouterState | undefined
}

export type State = Readonly<IState>
export type GeneralState = Readonly<IGeneralState>

const initialState: State = {
  ...initialGeneralState,
  routing: undefined,
}

const generalReducer = (state: GeneralState = initialGeneralState, action: Action<any>): GeneralState => {
  const actionHandler = actionHandlers[action.type] as (state: GeneralState, action: Action<any>) => GeneralState

  return (typeof actionHandler === 'function') ? actionHandler(state, action) : state
}

export const reducer: Reducer<State> = (state: State = initialState, action: Action<any>): State => {
  return {
    ...generalReducer(state, action),
    routing: routerReducer(state.routing, action),
  }
}
