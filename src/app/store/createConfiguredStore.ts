import { routerMiddleware } from 'react-router-redux';
import { History } from 'history';
import { createStore, applyMiddleware, compose, Middleware } from 'redux';
import { combineEpics, createEpicMiddleware, Epic } from 'redux-observable';
import {
  StoreState,
  Action,
  RequestDataPayload,
  ResolvedDataKey,
  ResolvedData,
} from './types';
import { reducer } from './reducer';
import { analyticsEpic } from 'store/features/analytics/epic';
import { updateUrlEpic } from 'store/features/search/updateUrlEpic';
import { dataResolverEpic } from 'store/features/asyncData/epic';
import { loggingEpic } from 'store/features/logging/epic';
import { nullResult } from 'helpers/asyncResults';
import { sendLogs } from 'helpers/sendLogs';
import { importGlobalScript } from 'helpers/importGlobalScript';

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
  sendLogs(actions: Action[]): Promise<void>;

  getGoogleAnalyticsFunction(): Promise<UniversalAnalytics.ga>;
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
  },
  alternativeSearchBoxText: null,
};

const defaultEpicDependencies: EpicDependencies = {
  async getResponseForDataRequest(payload) {
    return payload.load();
  },

  sendLogs,

  async getGoogleAnalyticsFunction() {
    await importGlobalScript('https://www.google-analytics.com/analytics.js');

    return ga;
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
  } else if (__IS_SERVER__ && process.env.NODE_ENV === 'development') {
    // Enable remote Redux DevTools for server-side Redux
    // tslint:disable-next-line:no-require-imports no-var-requires
    const { composeWithDevTools } = require('remote-redux-devtools');
    composeEnhancers = composeWithDevTools({
      hostname: 'localhost',
      port: 8000,
    });
  }

  const epics = [updateUrlEpic, dataResolverEpic];

  if (process.env.NODE_ENV === 'production' || __FORCE_ENABLE_LOGGING__) {
    epics.push(analyticsEpic, loggingEpic);
  }

  const rootEpic = combineEpics(...epics);

  const dependencies = {
    ...defaultEpicDependencies,
    ...epicDependenciesOverrides,
  };

  const wrappedRootEpic = wrapRootEpic ? wrapRootEpic(rootEpic) : rootEpic;
  const epicMiddleware = createEpicMiddleware<
    Action,
    StoreState,
    EpicDependencies
  >(wrappedRootEpic, {
    dependencies,
  });

  const middlewares = [
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
    module.hot.accept('./reducer', () => {
      // tslint:disable-next-line no-require-imports
      const nextRootReducer = require('./reducer').reducer;
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
