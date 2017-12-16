import { routerReducer, RouterState } from 'react-router-redux';
import {
  createStore,
  applyMiddleware,
  combineReducers,
  compose,
  Reducer as GenericReducer,
} from 'redux';
import { combineEpics, createEpicMiddleware } from 'redux-observable';
import { StoreState } from './types';
import { searchResultsReducer } from 'store/features/search/reducer';
import { searchEpic } from 'store/features/search/epic';

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
};

const appReducers = {
  searchResults: searchResultsReducer,
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
  initialState: StoreState = defaultInitialState,
) {
  return createStore<StoreState>(
    reducer,
    initialState,
    composeEnhancers(applyMiddleware(epicMiddleware)),
  );
}
