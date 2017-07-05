import createBrowserHistory from 'history/createBrowserHistory';
import { routerMiddleware } from 'react-router-redux';
import { applyMiddleware, compose, createStore } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { reducer } from 'store/reducers';
import { sagas } from 'store/sagas';
import { StoreState } from 'store/types';

export const history = createBrowserHistory();

// Initialize the default state object
const defaultInitialState: StoreState = {
  searchInputValue: '',
  searchResults: null,
  isSearchPending: false,
  loginStatus: 'unknown',
  isLoginPending: false,
  isLogoutPending: false,
  error: null,
  isNavMenuOpen: false,
  lastSearchTerm: '',
  createProfileUrlInputValue: '',
  notablePerson: null,
  userData: null,
  displayWarning: false,
  routing: undefined,
};

declare const window: Window & {
  __PRELOADED_STATE__: StoreState;
  __REDUX_DEVTOOLS_EXTENSION_COMPOSE__<E>(a: E): E;
};

const preloadedState = window.__PRELOADED_STATE__ || defaultInitialState;
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const sagaMiddleware = createSagaMiddleware();

delete window.__PRELOADED_STATE__;

export const store = createStore(
  reducer,
  preloadedState,
  composeEnhancers(applyMiddleware(routerMiddleware(history), sagaMiddleware)),
);

sagaMiddleware.run(sagas);
