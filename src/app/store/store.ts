import { routerMiddleware } from 'react-router-redux';
import { History } from 'history';
import { createStore, applyMiddleware, compose, Middleware } from 'redux';
import { identity } from 'lodash';
import { combineEpics, createEpicMiddleware, Epic } from 'redux-observable';
import { StoreState, Action } from './types';
import { reducer } from './reducer';
import { analyticsEpic } from 'store/features/analytics/epic';
import { updateUrlEpic } from 'store/features/search/updateUrlEpic';
import { dataResolverEpic } from 'store/features/data/epic';
import { nullResult } from 'helpers/asyncResults';

const defaultInitialState: StoreState = {
  routing: {
    location: null,
  },
  statusCode: 200,
  isSearchFocused: false,
  resolvedData: {
    searchResults: {
      ...nullResult,
      resolvedKey: null,
    },
    notablePersonQuery: {
      ...nullResult,
      resolvedKey: null,
    },
  },
};

declare const global: NodeJS.Global & {
  __REDUX_DEVTOOLS_EXTENSION_COMPOSE__: typeof compose | undefined;
};

const composeEnhancers =
  '__REDUX_DEVTOOLS_EXTENSION_COMPOSE__' in global &&
  global.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? global.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    : compose;

declare const module: {
  hot?: { accept(path?: string, cb?: () => void): void };
};

export function createStoreWithInitialState(
  history: History,
  initialState: StoreState = defaultInitialState,
  wrapEpic: (epic: Epic<Action, StoreState>) => typeof epic = identity,
  additionalMiddleware: Middleware[] = [],
) {
  const rootEpic = combineEpics(analyticsEpic, updateUrlEpic, dataResolverEpic);
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
