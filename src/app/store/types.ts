import {
  RouterState,
  LocationChangeAction,
  RouterAction,
} from 'react-router-redux';
import { AsyncResult } from 'helpers/asyncResults';
import { AlgoliaResponse } from 'algoliasearch';
import { NotablePersonQuery, ViewerQuery } from 'api/types';
import { DeepPartial } from 'typings/typeHelpers';

export type ResolvedData = {
  notablePersonQuery: NotablePersonQuery | null;
  searchResults: AlgoliaResponse | null;
  viewer: ViewerQuery;
};

export type ResolvedDataKey = keyof ResolvedData;

export type RequestDataPayload<
  Key extends ResolvedDataKey = ResolvedDataKey
> = {
  /**
   * Whether to keep the results of the previous request while loading
   * the new results
   */
  keepStaleData: boolean;

  /**
   * An incomplete optimistic version of the data that is expected
   * to be loaded.
   */
  optimisticResponse?: DeepPartial<ResolvedData[Key]>;

  /**
   * The key used to store the results in Redux state
   */
  key: ResolvedDataKey;

  /**
   * A unique identifier for the resolve request, if this changes,
   * `load()` will be called again
   */
  requestId: string | null;

  /**
   * (Optional)
   * The page path for which this data request is triggered, useful for logging
   */
  forPage?: string;

  /** An asynchronous function that fetches the data */
  load(): Promise<ResolvedData[Key]>;
};

export type SetResolvedDataPayload<
  Key extends ResolvedDataKey = ResolvedDataKey
> = {
  /**
   * The key used to store the results in Redux state
   */
  key: Key;

  /**
   * (Optional)
   * The page path for which this data request is triggered, useful for logging
   */
  forPage?: string;

  data: AsyncResult<ResolvedData[Key]> & {
    requestId: string | null;
  };
};

type SerializableError = {
  name: string;
  message: string;
  stack?: string;
};

export type AuthErrorCode = 'FB_INIT_ERROR';

export type AuthState =
  | {
      state: 'initializing' | 'loggingIn' | 'loggingOut' | 'loggedOut';
    }
  | {
      state: 'loggedIn';
      viewer: NonNullable<ViewerQuery['viewer']>;
    }
  | {
      state: 'error';
      code?: AuthErrorCode;
      error?: Error;
    };

export type FbSdkAuthState =
  | {
      state: 'initializing' | 'loggingIn' | 'loggingOut' | 'loggedOut';
    }
  | {
      state: 'loggedIn';
      accessToken: string;
    }
  | {
      state: 'error';
      code?: AuthErrorCode;
      error?: Error;
    };

/** A map of all app actions to their corresponding payloads */
export type ActionTypeToPayloadType = {
  GO_TO_SEARCH: void;
  SEARCH_QUERY_CHANGED: {
    query: string;
  };
  SET_SHOULD_FOCUS_SEARCH: boolean;
  SET_STATUS_CODE:
    | {
        code: 200 | 404;
      }
    | {
        code: 500;
        error?: SerializableError;
      }
    | {
        code: 301 | 302;
        redirectTo: string;
      };
  REQUEST_DATA: RequestDataPayload;
  SET_RESOLVED_DATA: SetResolvedDataPayload;
  UNHANDLED_ERROR_THROWN: SerializableError & {
    source?: string;
    line?: number;
    column?: number;
    location: Partial<Pick<Location, 'pathname' | 'search' | 'hash'>>;
  };
  PAGE_LOAD_FAILED: { path: string; error?: SerializableError };
  PAGE_LOAD_SUCCEEDED: { path: string };
  PAGE_REDIRECTED: {
    statusCode: 301 | 302;
    from: string;
    to: string;
  };
  /** Value is the path to the selected page */
  SEARCH_RESULT_SELECTED: string;
  SET_ALTERNATIVE_SEARCH_BOX_TEXT: string | null;
  '@@router/LOCATION_CHANGE': LocationChangeAction['payload'];
  '@@router/CALL_HISTORY_METHOD': RouterAction['payload'];
  SET_FB_SDK_AUTH_STATE: FbSdkAuthState;
  FACEBOOK_AUTH_RESPONSE_CHANGED: FB.AuthResponse;
  REQUEST_LOGIN: undefined;
  REQUEST_LOGOUT: undefined;
};

export type AppState = {
  statusCode: 301 | 302 | 404 | 200 | 500;
  redirectionUrl: string | null;
  shouldFocusSearch: boolean;
  /**
   * Used to display text in place of the search box when the user
   * scrolls the page down, like the notable person's name on the notable
   * person's page.
   */
  alternativeSearchBoxText: string | null;
  resolvedData: {
    [K in keyof ResolvedData]: AsyncResult<ResolvedData[K]> & {
      requestId: string | null;
    }
  };
  fbSdkAuthState: FbSdkAuthState;
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

export type Reducer<S> = (state: S, action: Action) => S;

export type ReducerMap<State extends object = AppState> = {
  [Key in keyof State]: Reducer<State[Key]> | any
};

export type ActionToReducerMap<Key extends StoreKey> = {
  [A in ActionType]: Reducer<AppState[Key]>
};

export type LoggedAction = Action & {
  timestamp: Date;
};

export type LogBatch<A extends Action = LoggedAction> = {
  actions: A[];
  sessionId: string;

  /**
   * Note: user agent cannot be read from the User-Agent header, instead
   * it must be sent in the action payload. This is because the User-Agent
   * header is not whitelisted in CloudFront so it's stripped before the request
   * is seen by the log endpoint.
   * White-listing the User-Agent header is an extremely
   * bad idea because it means a cache object will be created for every
   * browser/browser version/device combination.
   */
  userAgent?: string;
};
