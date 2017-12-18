import { routerMiddleware } from 'react-router-redux';
import { History } from 'history';
import { createStore, applyMiddleware, compose } from 'redux';
import { combineEpics, createEpicMiddleware } from 'redux-observable';
import { StoreState } from './types';
import { searchEpic } from './features/search/epic';
import { reducer } from './reducer';
import { analyticsEpic } from 'store/features/analytics/epic';

const defaultInitialState: StoreState = {
  searchResults: {
    hasError: false,
    isInProgress: false,
    value: null,
  },
  routing: {
    location: null,
  },
  statusCode: 200,
  lastSearchMatch: null,
};

const rootEpic = combineEpics(searchEpic, analyticsEpic);

const epicMiddleware = createEpicMiddleware(rootEpic);

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
) {
  const store = createStore<StoreState>(
    reducer,
    initialState,
    composeEnhancers(
      applyMiddleware(epicMiddleware, routerMiddleware(history)),
    ),
  );

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('store/reducer', () => {
      // tslint:disable-next-line no-require-imports
      const nextRootReducer = require('store/reducer').reducer;
      store.replaceReducer(nextRootReducer);
    });
  }

  return store;
}
