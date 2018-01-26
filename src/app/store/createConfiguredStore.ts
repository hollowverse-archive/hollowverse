import { routerMiddleware } from 'react-router-redux';
import { History } from 'history';
import { createStore, applyMiddleware, compose, Middleware } from 'redux';
import { identity } from 'lodash';
import { combineEpics, createEpicMiddleware, Epic } from 'redux-observable';
import { StoreState, Action } from './types';
import { reducer } from './reducer';
import { analyticsEpic } from 'store/features/analytics/epic';
import { updateUrlEpic } from 'store/features/search/updateUrlEpic';
import { dataResolverEpic } from 'store/features/asyncData/epic';
import { loggingEpic } from 'store/features/logging/epic';
import { nullResult } from 'helpers/asyncResults';

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

declare const global: NodeJS.Global & {
  __REDUX_DEVTOOLS_EXTENSION_COMPOSE__: typeof compose | undefined;
};

declare const module: {
  hot?: { accept(path?: string, cb?: () => void): void };
};

export function createConfiguredStore(
  history: History,
  initialState: StoreState = defaultInitialState,
  wrapEpic: (epic: Epic<Action, StoreState>) => typeof epic = identity,
  additionalMiddleware: Middleware[] = [],
) {
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
  const wrappedRootEpic = wrapEpic(rootEpic);
  const epicMiddleware = createEpicMiddleware(wrappedRootEpic);
  const store = createStore<StoreState>(
    reducer,
    initialState,
    composeEnhancers(
      applyMiddleware(
        epicMiddleware,
        routerMiddleware(history),
        ...additionalMiddleware,
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

  return { store, wrappedRootEpic };
}
