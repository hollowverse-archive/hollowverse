//
// REDUX REDUCERS
//
//
// This file contains:
// * Redux state shape
// * Redux single action reducers
// * Redux reducers
//
import { routerReducer, RouterState } from 'react-router-redux';
import { Reducer } from 'redux';
import { ActionTypes, IAction } from './actions';
import { INotablePersonSchema, IUserSchema } from 'typings/dataSchema';
import { HvError } from 'typings/typeDefinitions';
import { IAlgoliaSearchResults } from 'vendor/algolia';

// This interface defines the state properties of the Hollowverse app
interface IAppState {
  searchInputValue: string;
  searchResults: IAlgoliaSearchResults | null;
  isSearchPending: boolean;
  loginStatus: facebookSdk.LoginStatus;
  isLoginPending: boolean;
  isLogoutPending: boolean;
  error: HvError | null;
  isNavMenuOpen: boolean;
  lastSearchTerm: string;
  createProfileUrlInputValue: string;
  notablePerson: INotablePersonSchema | null;
  userData: IUserSchema | null;
  displayWarning: boolean;
}

// Make it an immutable type
type AppState = Readonly<IAppState>;

// Initialize the default state object
const initialAppState: AppState = {
  searchInputValue: '',
  searchResults: null,
  isSearchPending: false,
  loginStatus: 'unknown',
  isLoginPending: false,
  isLogoutPending: false,
  error: null,
  isNavMenuOpen: false,
  lastSearchTerm: '',
  createProfileUrlInputValue: '',
  notablePerson: null,
  userData: null,
  displayWarning: false,
};

// IRootState contains IAppState as well as other state keys that are required by external
// modules
interface IRootState extends IAppState {
  routing: RouterState | undefined;
}

// Make it an immutable type
export type State = Readonly<IRootState>;

// This is the root initial state of the whole application
const initialState: State = {
  ...initialAppState,
  routing: undefined,
};

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
// You can see how it's being used with the `singleActionReducers` object.
//
// We can do away with this function, but then we'll have a bunch of boilerplate for each key we patch.
function createSingleActionSimpleReducer<PayloadType>(
  stateKeyToPatch: keyof IAppState,
) {
  return (state: AppState, action: IAction<PayloadType>): AppState => {
    return { ...state, [stateKeyToPatch]: action.payload };
  };
}

// If you need to reduce a state property by using logic, you can use `createSingleActionReducer` below.
// It accepts one argument, a `patchingFunction`.
//
// For example:
//
// someActionType: createSingleActionReducer<boolean>(function(action, state) {
//   return {setIsLoginPending: !state.isLoginPending}
// })
// function createSingleActionReducer<PayloadType>(
//   patchingFunction: (
//     action: IAction<PayloadType>,
//     state: AppState,
//   ) => Partial<AppState>,
// ) {
//   return function singleActionReducer(
//     action: IAction<PayloadType>,
//     state: AppState,
//   ) {
//     return { ...state, ...patchingFunction(action, state) };
//   };
// }

// We get the `ActionTypes` from `/redux/actions.ts` and for each one, we create an appropriate reducer.
const singleActionReducers = {
  [ActionTypes.setSearchInputValue]: createSingleActionSimpleReducer<string>(
    'searchInputValue',
  ),
  [ActionTypes.setSearchResults]: createSingleActionSimpleReducer<
    IAlgoliaSearchResults | undefined
  >('searchResults'),
  [ActionTypes.setIsSearchPending]: createSingleActionSimpleReducer<boolean>(
    'isSearchPending',
  ),
  [ActionTypes.setLoginStatus]: createSingleActionSimpleReducer<
    facebookSdk.LoginStatus
  >('loginStatus'),
  [ActionTypes.setIsLoginPending]: createSingleActionSimpleReducer<boolean>(
    'isLoginPending',
  ),
  [ActionTypes.setIsLogoutPending]: createSingleActionSimpleReducer<boolean>(
    'isLogoutPending',
  ),
  [ActionTypes.setError]: createSingleActionSimpleReducer<HvError>('error'),
  [ActionTypes.setIsNavMenuOpen]: createSingleActionSimpleReducer<boolean>(
    'isNavMenuOpen',
  ),
  [ActionTypes.setLastSearchTerm]: createSingleActionSimpleReducer<string>(
    'lastSearchTerm',
  ),
  [ActionTypes.setCreateProfileUrlInputValue]: createSingleActionSimpleReducer<
    string
  >('createProfileUrlInputValue'),
  [ActionTypes.setNotablePerson]: createSingleActionSimpleReducer<
    INotablePersonSchema | undefined
  >('notablePerson'),
  [ActionTypes.setUserData]: createSingleActionSimpleReducer<
    IUserSchema | undefined
  >('userData'),
  [ActionTypes.toggleWarning]: createSingleActionSimpleReducer<boolean>(
    'displayWarning',
  ),
};

// A Redux reducer is simply a function that accepts `state` and `action` and returns a new `state`.
// That's what the function below does.
//
// The way it knows how to patch the state is by querying the `singleActionReducers` object above.
// If it finds a corresponding action reducer, it will use it to patch the state. Otherwise, it will
// return the state unmodified.
//
// `appReducer` is for Hollowverse state only. It is not the root reducer of the app.
const appReducer = (
  state: AppState = initialAppState,
  action: IAction<any>,
): AppState => {
  const actionReducer = singleActionReducers[action.type] as (
    state: AppState,
    action: IAction<any>,
  ) => AppState;

  /* tslint:disable:strict-type-predicates */
  return typeof actionReducer === 'function'
    ? actionReducer(state, action)
    : state;
  /* tslint:enable:strict-type-predicates */
};

// This is the root reducer of the app. It includes Hollowverse `appReducer` as well as other reducers
// that may be required by external modules.
export const reducer: Reducer<State> = (
  state: State = initialState,
  action: any,
): State => {
  return {
    ...appReducer(state, action),
    routing: routerReducer(state.routing, action),
  };
};
