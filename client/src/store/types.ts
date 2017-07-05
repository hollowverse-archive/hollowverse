import { AlgoliaSearchResults } from 'vendor/algolia';
import { HvError as AppError } from 'typings/typeDefinitions';
import { NotablePersonSchema, UserSchema } from 'typings/dataSchema';

export type StoreState = {
  // Search
  searchInputValue: string;
  searchResults: AlgoliaSearchResults | undefined;
  isSearchPending: boolean;
  lastSearchTerm: string;

  // Authentication
  loginStatus: facebookSdk.LoginStatus;
  isLoginPending: boolean;
  isLogoutPending: boolean;

  // General
  error: AppError;
  displayWarning: boolean;
  isNavMenuOpen: boolean;

  // Profile
  createProfileUrlInputValue: string;

  // Notable Person
  notablePerson: NotablePersonSchema | undefined;

  // User
  userData: UserSchema | undefined;
};

export type StoreKey = keyof StoreState;

/** A map of all app actions to their corresponding payloads */
export type PayloadsByActionType = {
  // General
  setError: AppError;
  toggleWarning: boolean;

  // Search
  setSearchInputValue: string;
  requestSearchResults: string;
  setIsSearchPending: boolean;
  setSearchError: string;
  setSearchResults: AlgoliaSearchResults | undefined;
  setLastSearchTerm: string;
  navigateToSearch: string;

  // Authentication
  requestLogin: void;
  setLoginStatus: facebookSdk.LoginStatus;
  requestUpdateLoginStatus: void;
  setIsLoginPending: boolean;
  setIsLogoutPending: boolean;
  requestLogout: void;

  // Navigation/Routing
  setIsNavMenuOpen: boolean;

  // Profile
  setCreateProfileUrlInputValue: string;

  // Notable person
  requestNotablePerson: string;
  setNotablePerson: NotablePersonSchema;

  // User
  setUserData: UserSchema;
};

/**
 * This type covers all possible action types that may be dispatched
 * throught the app.
 */
export type ActionType = keyof PayloadsByActionType;

/**
 * A typed payload.
 * It must one of the payloads defined above,
 * and must correspond to the action type T.
 */
export type Payload<T extends ActionType> = PayloadsByActionType[T];

export type GenericPayload = Payload<ActionType>;

/**
 * Typed app-specific action
 * The `payload` must correspond to the `type`.
 * This provides improved type checking and prevents dispatching an action
 * with the wrong payload type.
 */
export type Action<T extends ActionType> = {
  type: T;
  payload: Payload<T>;
};

/** Generic action, used when we do not care about what the type */
export type GenericAction = {
  type: ActionType;
  payload?: GenericPayload;
};

/** A typed version of Redux store.dispatch() */
export type Dispatch<T extends ActionType> = (
  action: Action<T>,
) => typeof action;

/**
 * A Generic dispatch function.
 * Used when we do not care about the action type
 * but it still requiers that the type of action is one of
 * the app actions defined above.
 */
export type GenericDispatch = Dispatch<ActionType>;

export type ActionCreator<T extends ActionType> = (
  payload: Payload<T>,
) => Action<T>;

export type GenericActionCreator = ActionCreator<ActionType>;

export type Reducer<S, A extends ActionType> = (
  state: S,
  action: Action<A>,
) => S;

export type ReducerMap = {
  [Key in StoreKey]: Reducer<StoreState[Key], ActionType>
};

export type ActionToReducerMap<Key extends StoreKey> = {
  [A in ActionType]: Reducer<StoreState[Key], A>
};

/**
 * The default props passed by `react-redux`'s `connect()`
 * when no `mapDispatchProps` is passed as the second argument.
 * This type provides strong typing for `dispatch()` and it only accepts
 * actions defined in our app.
 */
export type DefaultDispatchProps = {
  dispatch<A extends GenericAction>(action: A): typeof action;
};
