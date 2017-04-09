import {createStore, applyMiddleware, compose} from 'redux'
import {reducer} from './reducers'
import {routerMiddleware} from 'react-router-redux'
import createBrowserHistory from 'history/createBrowserHistory'
import createSagaMiddleware from 'redux-saga'
import {sagas} from './sagas'

export const history = createBrowserHistory()

const preloadedState = window.__PRELOADED_STATE__
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
const sagaMiddleware = createSagaMiddleware()

delete window.__PRELOADED_STATE__

export const store = createStore(
  reducer,
  preloadedState,
  composeEnhancers(applyMiddleware(
    routerMiddleware(history),
    sagaMiddleware,
  )),
)

sagaMiddleware.run(sagas)
