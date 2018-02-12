import { routerMiddleware } from 'react-router-redux';
import { History } from 'history';
import { createStore, applyMiddleware, compose, Middleware } from 'redux';
import { combineEpics, createEpicMiddleware, Epic } from 'redux-observable';
import { StoreState, Action, RequestDataPayload, ResolvedDataKey, ResolvedData } from './types';
import { reducer } from './reducer';
import { analyticsEpic } from 'store/features/analytics/epic';
import { updateUrlEpic } from 'store/features/search/updateUrlEpic';
import { dataResolverEpic } from 'store/features/asyncData/epic';
import { loggingEpic } from 'store/features/logging/epic';
import { nullResult } from 'helpers/asyncResults';

export const defaultInitialState: StoreState = {
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

export type EpicDependencies = {
  /**
   * Enables us to hook into data fetching requests in order to transform
   * or replace the response. This is useful for mocking API responses in
   * tests.
   */
  getResponseForDataRequest<K extends ResolvedDataKey>
    (payload: RequestDataPayload<K>): Promise<ResolvedData[K]>;
};

declare const global: NodeJS.Global & {
  __REDUX_DEVTOOLS_EXTENSION_COMPOSE__: typeof compose | undefined;
};

declare const module: {
  hot?: { accept(path?: string, cb?: () => void): void };
};

export const defaultEpicDependencies: EpicDependencies = {
  async getResponseForDataRequest(payload) {
    return payload.load();
  },
};

type CreateConfiguredStoreOptions = {
  history: History,
  initialState?: StoreState,
  additionalMiddleware?: Middleware[],
  dependencyOverrides?: Partial<EpicDependencies>,
  wrapRootEpic?(epic: Epic<Action, StoreState>): typeof epic,
};

export function createConfiguredStore({
  history,
  initialState = defaultInitialState,
  wrapRootEpic,
  additionalMiddleware = [],
  dependencyOverrides = { },
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

  const rootEpic = combineEpics(
    analyticsEpic,
    updateUrlEpic,
    dataResolverEpic,
    loggingEpic,
  );
  
  const dependencies = {
    ...defaultEpicDependencies,
    ...dependencyOverrides,
  };

  const wrappedRootEpic = wrapRootEpic ? wrapRootEpic(rootEpic) : rootEpic;
  const epicMiddleware = createEpicMiddleware<Action, StoreState, EpicDependencies>(wrappedRootEpic, {
    dependencies,
  });

  const middlewares = [
    epicMiddleware,
    routerMiddleware(history),
    ...additionalMiddleware
  ];

  const store = createStore<StoreState>(
    reducer,
    initialState,
    composeEnhancers(
      applyMiddleware(
        ...middlewares,
      ),
    ),
  );

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('./reducer', () => {
      // tslint:disable-next-line no-require-imports
      const nextRootReducer = require('./reducer').reducer;
      store.replaceReducer(nextRootReducer);
    });
  }

  return { store, wrappedRootEpic, dependencies, initialState, middlewares };
}
