import {createStore, applyMiddleware, compose} from 'redux'
import {reducer} from '../../client/src/redux/reducers'
import thunkMiddleware from 'redux-thunk'

const composeEnhancers = compose

export const store = createStore(
  reducer,
  composeEnhancers(applyMiddleware(thunkMiddleware)),
)
