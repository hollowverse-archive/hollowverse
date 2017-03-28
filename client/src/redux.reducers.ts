import {Action} from './redux.utils'
import {Reducer} from 'redux';
import {routerReducer, RouterState} from 'react-router-redux'
import {IGeneralState, initialGeneralState, actionHandlers} from './redux.actions'

import LoginStatus = facebookSdk.LoginStatus

interface IState extends IGeneralState {
  routing: RouterState | undefined
}

export type State = Readonly<IState>
export type GeneralState = Readonly<IGeneralState>

const initialState: State = {
  ...initialGeneralState,
  routing: undefined
}

const generalReducer = (state: GeneralState = initialGeneralState, action: Action<any>): GeneralState => {
  const actionHandler = actionHandlers[action.type] as (state: GeneralState, action: Action<any>) => GeneralState

  return (typeof actionHandler === 'function') ? actionHandler(state, action) : state
}

export const reducer: Reducer<State> = (state: State = initialState, action: Action<any>): State => {
  return {
    ...generalReducer(state, action),
    routing: routerReducer(state.routing, action)
  }
}
