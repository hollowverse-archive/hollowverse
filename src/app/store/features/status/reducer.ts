import { handleActions, isActionOfType } from 'store/helpers';
import { StoreState } from 'store/types';

export const statusCodeReducer = handleActions<'statusCode'>(
  {
    SET_STATUS_CODE: (state, action) => {
      if (isActionOfType(action, 'SET_STATUS_CODE')) {
        return action.payload;
      }

      return state;
    },
  },
  200,
);

export const getStatusCode = (state: StoreState) => state.statusCode;
