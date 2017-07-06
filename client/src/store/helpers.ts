import {
  Action,
  ActionType,
  ActionCreator,
  ActionToReducerMap,
  StoreState,
  StoreKey,
  PayloadsByActionType,
  Reducer,
  GenericAction,
} from 'store/types';

/**
 * A helper functions that creates an action of a specific type,
 * the payload must correspond to the action type.
 */
export function createAction<T extends ActionType>(
  type: T,
  payload: PayloadsByActionType[T],
): Action<T> {
  return {
    type,
    payload,
  };
}

/** A better typed version of `redux-action`'s `createAction`.
 * It only accepts valid action types and returs an action creator
 * that only accept valid payloads matching that type.
 */
export function createActionCreator<T extends ActionType>(
  type: T,
): ActionCreator<T> {
  return (payload: PayloadsByActionType[T]) => createAction<T>(type, payload);
}

/**
 * A better typed version of `redux-action`'s `handleActions`.
 * It requires that the map keys are store keys and that the return
 * type of the reducer matches the state of that store key.
 */
export function handleActions<Key extends StoreKey>(
  map: ActionToReducerMap<Key>,
  defaultState: StoreState[Key],
): Reducer<StoreState[Key]> {
  return (state: StoreState[Key], action: Action<ActionType>) => {
    const reducer: Reducer<StoreState[Key]> | undefined = map[action.type];
    if (reducer !== undefined) {
      return reducer(state, action);
    }
    if (state !== undefined) {
      return state;
    }

    return defaultState;
  };
}

/**
 * Type guard for actions
 * It allows TypeScript to guarantee that an action is of a specific type,
 * providing better autocomplete suggestions and type checking in control flow.
 * 
 * Here is an example:
 * 
 * ```
 * const action = {
 *  type: 'REQUEST_LOGIN',
 *  payload: {
 *    email: 'email@example.com',
 *    password: '123456',
 *  }
 * };
 * if (isActionOfType(action, 'REQUEST_LOGIN')) {
 *  const { payload } = action;
 *  payload.email // <-- TypeScript now knows that the payload has an `email` property.
 * }
 * ```
 */
export function isActionOfType<T extends ActionType>(
  action: GenericAction,
  type: T,
): action is Action<T> {
  return type === action.type;
}

/** Creates a reducer that handles a single action for an individual state entry.  */
export function handleAction<
  K extends keyof S = keyof S,
  S = StoreState,
  A extends ActionType = ActionType
>(actionType: A, defaultState: S[K]) {
  return (state: S[K], action: GenericAction) => {
    if (isActionOfType(action, actionType) && action.payload !== undefined) {
      return action.payload;
    }

    return state || defaultState;
  };
}
