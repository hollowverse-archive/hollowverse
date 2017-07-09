import { RouterState } from 'react-router-redux';
import { AlgoliaSearchResults } from 'vendor/algolia';
import { HvError } from 'typings/typeDefinitions';
import { NotablePersonSchema, UserSchema } from 'typings/dataSchema';

export type AppState = {
  // Search
  searchInputValue: string;
  searchResults: AlgoliaSearchResults | null;
  isSearchPending: boolean;
  lastSearchTerm: string;

  // Authentication
  loginStatus: facebookSdk.LoginStatus;
  isLoginPending: boolean;
  isLogoutPending: boolean;

  // General
  error: HvError | null;
  displayWarning: boolean;
  isNavMenuOpen: boolean;

  // Profile
  createProfileUrlInputValue: string;

  // Notable Person
  notablePerson: NotablePersonSchema | null;

  // User
  userData: UserSchema | null;
};

interface RoutingState {
  routing: RouterState | undefined;
}

/**
 * RootState contains AppState as well as other state keys that are
 * required by external modules
 */
export type StoreState = Readonly<AppState & RoutingState>;

export type StoreKey = keyof StoreState;

/** A map of all app actions to their corresponding payloads */
export type PayloadsByActionType = {
  // General
  setError: HvError;
  toggleWarning: boolean;

  // Search
  setSearchInputValue: string;
  requestSearchResults: string;
  setIsSearchPending: boolean;
  setSearchError: string;
  setSearchResults: AlgoliaSearchResults | null;
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
  /**
   * The slug used to request the notable person's data
   * @example: `Tom_Hanks`
   */
  requestNotablePerson: string;
  setNotablePerson: NotablePersonSchema;

  // User
  requestUserData: void;
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
 * but it still requires that the type of action is one of
 * the action types defined above.
 */
export type GenericDispatch = Dispatch<ActionType>;

export type ActionCreator<T extends ActionType> = (
  payload: Payload<T>,
) => Action<T>;

export type GenericActionCreator = ActionCreator<ActionType>;

export type Reducer<S> = (state: S, action: GenericAction) => S;

export type ReducerMap<State extends object = StoreState> = {
  // tslint:disable-next-line no-suspicious-comment
  // @FIXME: Remove `any` from mapped type.
  //
  // TS does not currently narrow down generic type parameters
  // So `Reducer<State[Key]>` is equivalent to `Reducer<keyof State>`
  // which means we cannot safely inform TS that this state entry should
  // only accept a reducer with a compatible return type.
  //
  // If `any` is removed in TS <= 2.4, the type checker will try to match
  // **each** reducer's return type with **every** type in the entire state
  // and the types won't be compatible.
  //
  // Refer to this issue: https://github.com/Microsoft/TypeScript/issues/10717
  [Key in keyof State]: Reducer<State[Key]> | any
};

export type ActionToReducerMap<Key extends StoreKey> = {
  [A in ActionType]: Reducer<StoreState[Key]>
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
