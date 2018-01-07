import {
  RouterState,
  LocationChangeAction,
  RouterAction,
} from 'react-router-redux';
import { AsyncResult } from 'helpers/asyncResults';
import { AlgoliaResponse } from 'algoliasearch';
import { NotablePersonQuery } from 'api/types';

/** A map of all app actions to their corresponding payloads */
export type ActionTypeToPayloadType = {
  SEARCH_QUERY_CHANGED: {
    query: string;
  };
  SET_SHOULD_FOCUS_SEARCH: boolean;
  SET_STATUS_CODE: number;
  SET_REDIRECTION_URL: string;
  REQUEST_DATA: {
    allowOptimisticUpdates: boolean;
    key: ResolvedDataKey;
    requestId: string | null;
    load(): Promise<ResolvedData[ResolvedDataKey]>;
  };
  SET_RESOLVED_DATA: {
    key: ResolvedDataKey;
    data: AsyncResult<ResolvedData[ResolvedDataKey]> & {
      requestId: string | null;
    };
  };
  UNHANDLED_ERROR_THROWN: {
    message: string;
    source?: string;
    line?: number;
    column?: number;
  };
  URL_CLICKED: {
    url: string;
  };
  PAGE_LOAD_FAILED: string;
  PAGE_LOAD_SUCCEEDED: string;
  '@@router/LOCATION_CHANGE': LocationChangeAction['payload'];
  '@@router/CALL_HISTORY_METHOD': RouterAction['payload'];
};

export type ResolvedData = {
  notablePersonQuery: NotablePersonQuery | null;
  searchResults: AlgoliaResponse | null;
};

export type ResolvedDataKey = keyof ResolvedData;

export type AppState = {
  statusCode: number;
  shouldFocusSearch: boolean;
  redirectionUrl: string | null;
  resolvedData: {
    [K in keyof ResolvedData]: AsyncResult<ResolvedData[K] | null> & {
      requestId: string | null;
    }
  };
};

/**
 * Contains AppState as well as other state keys that are
 * required by external modules
 */
export type StoreState = Readonly<AppState & { routing: RouterState }>;

export type StoreKey = keyof AppState;

/**
 * This type covers all possible action types that may be dispatched
 * throughout the app.
 */
export type ActionType = keyof ActionTypeToPayloadType;

/**
 * A typed payload.
 * It must one of the payloads defined above,
 * and must correspond to the action type `T`.
 */
export type Payload<T extends ActionType> = ActionTypeToPayloadType[T];

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

export type Reducer<S> = (state: S, action: Action<ActionType>) => S;

export type ReducerMap<State extends object = AppState> = {
  [Key in keyof State]: Reducer<State[Key]> | any
};

export type ActionToReducerMap<Key extends StoreKey> = {
  [A in ActionType]: Reducer<AppState[Key]>
};
