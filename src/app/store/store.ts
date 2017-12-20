import { routerMiddleware } from 'react-router-redux';
import { History } from 'history';
import { createStore, applyMiddleware, compose } from 'redux';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/mergeMap';

import { combineEpics, createEpicMiddleware, Epic } from 'redux-observable';
import { StoreState, Action } from './types';
import { reducer } from './reducer';
import { analyticsEpic } from 'store/features/analytics/epic';
import { updateUrlEpic } from 'store/features/search/updateUrlEpic';

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
  isSearchFocused: false,
};

const epic$ = new BehaviorSubject(combineEpics(analyticsEpic, updateUrlEpic));

export const addLazyEpic = (epic: Epic<Action, StoreState>) => epic$.next(epic);

// Add epics lazily as they are imported from different chunks accross
// the app.
// See https://redux-observable.js.org/docs/recipes/AddingNewEpicsAsynchronously.html
const rootEpic: Epic<Action, StoreState> = (action$, store) =>
  epic$.mergeMap(epic => epic(action$, store, undefined));

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
    module.hot.accept('./reducer', () => {
      // tslint:disable-next-line no-require-imports
      const nextRootReducer = require('./reducer').reducer;
      store.replaceReducer(nextRootReducer);
    });
  }

  return store;
}
