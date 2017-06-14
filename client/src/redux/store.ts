import {connectRouter, routerMiddleware} from 'connected-react-router'
import {createBrowserHistory} from 'history'
import {applyMiddleware, compose, createStore} from 'redux'
import createSagaMiddleware from 'redux-saga'
import {reducer} from './reducers'
import {sagas} from './sagas'

export const history = createBrowserHistory()

const preloadedState = window.__PRELOADED_STATE__
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
const sagaMiddleware = createSagaMiddleware()

delete window.__PRELOADED_STATE__

export const store = createStore(
  connectRouter(history)(reducer),
  preloadedState,
  composeEnhancers(applyMiddleware(
    routerMiddleware(history),
    sagaMiddleware,
  )),
)

sagaMiddleware.run(sagas)
