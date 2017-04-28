import {GeneralState} from './reducers'

export interface Action<PayloadType> { type: string, payload: PayloadType}
export type ActionCreator<PayloadType> = (payload: PayloadType) => Action<PayloadType>

export function handleAction<T>(
  patchingValue: ((action: Action<T>, state: GeneralState) => Partial<GeneralState>) | (keyof GeneralState),
) {
  let actionHandler: (state: GeneralState, action: Action<T>) => GeneralState

  if (typeof patchingValue === 'string') {
    actionHandler = (state, action) => ({...state, [patchingValue]: action.payload})
  } else {
    actionHandler = (state, action) => ({...state, ...patchingValue(action, state)})
  }

  return actionHandler
}
