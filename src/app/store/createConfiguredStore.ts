/* eslint-disable no-underscore-dangle */

import { routerMiddleware } from 'react-router-redux';
import { History } from 'history';
import {
  createStore,
  applyMiddleware,
  compose,
  Middleware,
  Dispatch,
} from 'redux';
import { combineEpics, createEpicMiddleware, Epic } from 'redux-observable';
import {
  StoreState,
  Action,
  RequestDataPayload,
  ResolvedDataKey,
  ResolvedData,
  LogBatch,
} from './types';
import { reducer } from './reducer';
import { analyticsEpic } from 'store/features/analytics/epic';
import { updateUrlEpic } from 'store/features/search/updateUrlEpic';
import { dataResolverEpic } from 'store/features/asyncData/epic';
import { loggingEpic } from 'store/features/logging/epic';
import { nullResult, pendingResult } from 'helpers/asyncResults';
import { sendLogs, getSessionId, getUserAgent } from 'helpers/logging';
import { importGlobalScript } from 'helpers/importGlobalScript';
import { isError } from 'lodash';
import { serializeError } from 'helpers/serializeError';
import { authEpic } from './features/auth/epic';

declare const global: NodeJS.Global & {
  /**
   * Added by Redux DevTools extension for Chrome and Firefox
   * See https://github.com/zalmoxisus/redux-devtools-extension
   */
  __REDUX_DEVTOOLS_EXTENSION_COMPOSE__: typeof compose | undefined;
};

/**
 * Epics are usually used to produce side-effects in response to actions, so
 * naturally they need to perform things like sending data over the network,
 * store data in `localStorage`... etc.
 *
 * While an epic can directly use `localStorage` or `fetch`, accessing global
 * APIs in this way makes it hard to test the store functionality, it also
 * makes the code less portable because it can no longer work in Node.js without
 * global polyfills.
 *
 * Instead of having epics import their dependencies and use them directly,
 * `redux-observable` allows injecting dependencies into the epics. This helps
 * with testing and portability, because we can now more easily replace the
 * dependency implementation when creating the epics. This works well with
 * TypeScript because it requires that implementations conform to the expected
 * shape.
 *
 * @see https://redux-observable.js.org/docs/recipes/InjectingDependenciesIntoEpics.html
 */
export type EpicDependencies = {
  /**
   * Enables us to hook into data fetching requests in order to transform
   * or replace the response. This is useful for mocking API responses in
   * tests.
   */
  getResponseForDataRequest<K extends ResolvedDataKey>(
    payload: RequestDataPayload<K>,
  ): Promise<ResolvedData[K]>;

  /**
   * Replaces the log sending function implementation, which sends
   * logs in batches.
   */
  sendLogs(batch: LogBatch): Promise<void>;

  getSessionId(): string;
  getUserAgent(): string;

  getGoogleAnalyticsFunction(): Promise<UniversalAnalytics.ga>;

  getFbSdk(): Promise<facebookSdk.Fb>;
};

export type CreateConfiguredStoreOptions = {
  history: History;
  initialState?: StoreState;
  additionalMiddleware?: Middleware[];
  epicDependenciesOverrides?: Partial<EpicDependencies>;
  wrapRootEpic?(epic: Epic<Action, StoreState>): typeof epic;
};

// Added by Webpack
declare const module: {
  hot?: {
    accept(path?: string, cb?: () => void): void;
  };
};

const defaultInitialState: StoreState = {
  routing: {
    location: null,
  },
  statusCode: 200,
  redirectionUrl: null,
  shouldFocusSearch: false,
  resolvedData: {
    searchResults: {
      ...nullResult,
      requestId: null,
    },
    notablePersonQuery: {
      ...nullResult,
      requestId: null,
    },
    viewer: {
      ...pendingResult,
      requestId: null,
    },
  },
  alternativeSearchBoxText: null,
  fbSdkAuthState: {
    state: 'initializing',
  },
};

const defaultEpicDependencies: EpicDependencies = {
  async getResponseForDataRequest(payload) {
    return payload.load();
  },

  sendLogs,

  getSessionId,

  getUserAgent,

  async getGoogleAnalyticsFunction() {
    await importGlobalScript('https://www.google-analytics.com/analytics.js');

    return ga;
  },

  async getFbSdk() {
    await importGlobalScript('https://connect.facebook.net/en_US/sdk.js');

    return FB;
  },
};

export function createConfiguredStore({
  history,
  initialState = defaultInitialState,
  wrapRootEpic,
  additionalMiddleware = [],
  epicDependenciesOverrides = {},
}: CreateConfiguredStoreOptions) {
  let composeEnhancers = compose;

  if (global.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) {
    composeEnhancers = global.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__;
  }

  const epics = [updateUrlEpic, dataResolverEpic, authEpic, loggingEpic];

  const dependencies = {
    ...defaultEpicDependencies,
    ...epicDependenciesOverrides,
  };

  if (process.env.NODE_ENV === 'production' || __FORCE_ENABLE_LOGGING__) {
    epics.push(analyticsEpic);
  } else {
    dependencies.sendLogs = async ({ actions, sessionId, userAgent }) => {
      // tslint:disable-next-line no-console
      console.info('The following log batch would be sent in production:');
      console.table({ userAgent, sessionId });
      console.table(actions);
    };
  }

  const rootEpic = combineEpics(...epics);

  const wrappedRootEpic = wrapRootEpic ? wrapRootEpic(rootEpic) : rootEpic;
  const epicMiddleware = createEpicMiddleware<
    Action,
    StoreState,
    EpicDependencies
  >(wrappedRootEpic, {
    dependencies,
  });

  const serializeErrorsMiddleware = () => (next: Dispatch<Action>) => (
    action: Action,
  ) => {
    if (
      typeof action.payload === 'object' &&
      action.payload !== null &&
      'error' in action.payload &&
      isError(action.payload.error)
    ) {
      return next({
        ...action,
        payload: {
          ...action.payload,
          error: serializeError(action.payload.error),
        },
      });
    }

    return next(action);
  };

  const middlewares = [
    serializeErrorsMiddleware as Middleware,
    epicMiddleware,
    routerMiddleware(history),
    ...additionalMiddleware,
  ];

  const store = createStore<StoreState>(
    reducer,
    initialState,
    composeEnhancers(applyMiddleware(...middlewares)),
  );

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('./reducer', async () => {
      const nextRootReducer = await import('./reducer').then(m => m.reducer);
      store.replaceReducer(nextRootReducer);
    });
  }

  return {
    store,
    wrappedRootEpic,
    dependencies,
    initialState,
    middlewares,
    history,
  };
}
