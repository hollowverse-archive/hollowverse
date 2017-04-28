//
// REDUX REDUCERS
//
//
// This file contains:
// * Redux state shape
// * Redux single action reducers
// * Redux reducers
//
import {Reducer} from 'redux'
import {routerReducer, RouterState} from 'react-router-redux'
import {ActionTypes, Action} from './actions'
import LoginStatus = facebookSdk.LoginStatus
import {IAlgoliaSearchResults} from '../vendor/algolia'
import {HvError} from '../typeDefinitions'

// This interface defines the state keys of the Hollowverse app
interface IAppState {
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

// Let's mark IAppState as read only to make sure our reducers and code don't accidentally
// try to mutate it.
type AppState = Readonly<IAppState>

// Initialize the default state object
const initialAppState: AppState = {
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

// IRootState contains IAppState as well as other state keys that are required by external
// modules
interface IRootState extends IAppState {
  routing: RouterState | undefined
}

// Let's mark IRootState as read only to make sure our reducers and code don't accidentally
// try to mutate it.
export type State = Readonly<IRootState>

// This is the root initial state of our application
const initialState: State = {
  ...initialAppState,
  routing: undefined,
}

// We get the `ActionTypes` from `/redux/actions.ts` and for each one, we create an appropriate reducer.
const singleActionReducers = {
  [ActionTypes.setSearchInputValue]: createSingleActionSimpleReducer<string>('searchInputValue'),
  [ActionTypes.setSearchResults]: createSingleActionSimpleReducer<IAlgoliaSearchResults | undefined>('searchResults'),
  [ActionTypes.setIsSearchPending]: createSingleActionSimpleReducer<boolean>('isSearchPending'),
  [ActionTypes.setLoginStatus]: createSingleActionSimpleReducer<facebookSdk.LoginStatus>('loginStatus'),
  [ActionTypes.setIsLoginPending]: createSingleActionSimpleReducer<boolean>('isLoginPending'),
  [ActionTypes.setIsLogoutPending]: createSingleActionSimpleReducer<boolean>('isLogoutPending'),
  [ActionTypes.setError]: createSingleActionSimpleReducer<HvError>('error'),
  [ActionTypes.setIsNavMenuOpen]: createSingleActionSimpleReducer<boolean>('isNavMenuOpen'),
  [ActionTypes.setLastSearchTerm]: createSingleActionSimpleReducer<string>('lastSearchTerm'),
  [ActionTypes.setCreateProfileUrlInputValue]: createSingleActionSimpleReducer<string>('createProfileUrlInputValue'),
}

// A Redux reducer is simply a function that accepts `state` and `action` and returns a new `state`.
// That's what the function below does.
//
// The way it knows how to modify the state is by querying the `singleActionReducers` object above.
// If it finds a corresponding action reducer, it will use it to patch the state. Otherwise, it will
// return the state unmodified.
//
// `appReducer` is for Hollowverse state only. It is not the root reducer of the app.
const appReducer = (state: AppState = initialAppState, action: Action<any>): AppState => {
  const actionReducer = singleActionReducers[action.type] as (state: AppState, action: Action<any>) => AppState

  return (typeof actionReducer === 'function') ?
    actionReducer(state, action) :
    state
}

// This is the root reducer of the app. It includes Hollowverse `appReducer` as well as other reducers
// that may be required by external modules.
export const reducer: Reducer<State> = (state: State = initialState, action: Action<any>): State => {
  return {
    ...appReducer(state, action),
    routing: routerReducer(state.routing, action),
  }
}

//
// PRIVATE FUNCTIONS
//
//

// For each Redux action, there would be at least one corresponding state key to be patched.
//
// For example, say you dispatch an action `setLoginStatus('connected')`, you
// would have to have a reducer that will patch the state key `loginStatus` with the value `'connected'`.
//
// What this function does is: for any payload that simply needs to be inserted into the state without any logic
// it will return a function that inserts that payload into the state and returns the new state.
//
// You can see how it's being used below with the `singleActionReducers` object.
//
// We can do away with this function, but then we'll have a bunch of boilerplate for each key we patch.
function createSingleActionSimpleReducer<PayloadType>(stateKeyToPatch: keyof IAppState) {
  return function singleActionSimpleReducer(state: AppState, action: Action<PayloadType>): AppState {
    return ({...state, [stateKeyToPatch]: action.payload})
  }
}

// If you need to reduce a state property by using logic, you can use `createSingleActionReducer` below.
// It accepts one argument, a `patchingFunction`.
//
// For example:
//
// someActionType: createSingleActionReducer<boolean>(function(action, state) {
//   return {setIsLoginPending: !state.isLoginPending}
// })
function createSingleActionReducer<PayloadType>(
  patchingFunction: (action: Action<PayloadType>, state: AppState) => Partial<AppState>,
) {
  return function singleActionReducer(action: Action<PayloadType>, state: AppState) {
    return {...state, ...patchingFunction(action, state)}
  }
}
