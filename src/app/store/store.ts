import { createStore, applyMiddleware, combineReducers, compose } from 'redux';
import { combineEpics, createEpicMiddleware } from 'redux-observable';
import { StoreState } from './types';
import {
  searchResultsReducer,
  searchQueryReducer,
} from 'store/features/search/reducer';
import { searchEpic } from 'store/features/search/epic';

const defaultInitialState: StoreState = {
  searchResults: {
    hasError: false,
    isInProgress: false,
    value: null,
  },
  searchQuery: null,
};

const reducer = combineReducers<StoreState>({
  searchResults: searchResultsReducer,
  searchQuery: searchQueryReducer,
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
