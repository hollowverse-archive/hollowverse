import { AlgoliaResponse } from 'algoliasearch';

/** A map of all app actions to their corresponding payloads */
export type TypeToPayload = {
  REQUEST_SEARCH_RESULTS: {
    query: string;
  };
  SET_SEARCH_RESULTS: {
    results: AlgoliaResponse;
  };
  SET_VALUE_FOR_STORE_KEY: {
    key: StoreKey;
    value: any;
  };
  SET_SEARCH_ERROR: {
    error: Error;
  };
};

type ErrorResult = {
  isInProgress: false;
  hasError: true;
  value: null;
};

type OptimisticResult<T = null> = {
  isInProgress: true;
  hasError: false;
  value: T;
};

type PendingResult = OptimisticResult<null>;

type SuccessResult<T> = {
  isInProgress: false;
  hasError: false;
  value: T;
};

type AsyncResult<T> =
  | ErrorResult
  | PendingResult
  | OptimisticResult<T>
  | SuccessResult<T>;

export type AppState = {
  searchResults: AsyncResult<AlgoliaResponse | null>;
};

/**
 * Contains AppState as well as other state keys that are
 * required by external modules
 */
export type StoreState = Readonly<AppState>;

export type StoreKey = keyof StoreState;

/**
 * This type covers all possible action types that may be dispatched
 * throught the app.
 */
export type ActionType = keyof TypeToPayload;

/**
 * A typed payload.
 * It must one of the payloads defined above,
 * and must correspond to the action type `T`.
 */
export type Payload<T extends ActionType> = TypeToPayload[T];

export type GenericPayload = Payload<ActionType>;

/** Generic action, used when we do not care about what the type */
export type GenericAction = {
  type: ActionType;
  payload?: GenericPayload;
};

/**
 * Typed app-specific action
 * The `payload` must correspond to the `type`.
 * This provides improved type checking and prevents dispatching an action
 * with the wrong payload type.
 */
export type Action<T extends ActionType = ActionType> = {
  type: T;
  payload: Payload<T>;
};

export type ActionCreator<T extends ActionType> = (
  payload: Payload<T>,
) => Action<T>;

export type Reducer<S> = (state: S, action: GenericAction) => S;

export type ReducerMap<State extends object = StoreState> = {
  [Key in keyof State]: Reducer<State[Key]> | any
};

export type ActionToReducerMap<Key extends StoreKey> = {
  [A in ActionType]: Reducer<StoreState[Key]>
};
