import {createStore, applyMiddleware, compose} from 'redux'
import {reducer} from './reducers'
import thunkMiddleware from 'redux-thunk'
import {routerMiddleware} from 'react-router-redux'
import {browserHistory} from 'react-router'
import createSagaMiddleware from 'redux-saga'
import {sagas} from './sagas'

const preloadedState = window.__PRELOADED_STATE__
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
const sagaMiddleware = createSagaMiddleware()

delete window.__PRELOADED_STATE__

export const store = createStore(
  reducer,
  preloadedState,
  composeEnhancers(applyMiddleware(
    thunkMiddleware,
    routerMiddleware(browserHistory),
    sagaMiddleware,
  )),
)

sagaMiddleware.run(sagas)
