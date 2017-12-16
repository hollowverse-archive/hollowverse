import {
  routerReducer,
  routerMiddleware,
  RouterState,
} from 'react-router-redux';
import { History } from 'history';
import {
  createStore,
  applyMiddleware,
  combineReducers,
  compose,
  Reducer as GenericReducer,
} from 'redux';
import { combineEpics, createEpicMiddleware } from 'redux-observable';
import { StoreState, ReducerMap } from './types';
import { statusCodeReducer } from 'store/features/status/reducer';
import { searchEpic } from 'store/features/search/epic';

const defaultInitialState: StoreState = {
  routing: {
    location: null,
  },
  statusCode: 200,
};

const appReducers: ReducerMap = {
  statusCode: statusCodeReducer,
};

/**
 * This is the root reducer of the app.
 * It includes Hollowverse `appReducer` as well as other reducers
 * that may be required by external modules.
 */
export const reducer = combineReducers<StoreState>({
  ...appReducers,
  routing: routerReducer as GenericReducer<RouterState>,
});

const rootEpic = combineEpics(searchEpic);

const epicMiddleware = createEpicMiddleware(rootEpic);

declare const global: NodeJS.Global & {
  __REDUX_DEVTOOLS_EXTENSION_COMPOSE__: typeof compose | undefined;
};

const composeEnhancers =
  '__REDUX_DEVTOOLS_EXTENSION_COMPOSE__' in global &&
  global.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? global.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    : compose;

export function createStoreWithInitialState(
  history: History,
  initialState: StoreState = defaultInitialState,
) {
  return createStore<StoreState>(
    reducer,
    initialState,
    composeEnhancers(
      applyMiddleware(epicMiddleware, routerMiddleware(history)),
    ),
  );
}
