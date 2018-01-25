import { createReducerForStoreKey, isActionOfType } from 'store/helpers';
import { StoreState } from 'store/types';

export const statusCodeReducer = createReducerForStoreKey<'statusCode'>(
  {
    SET_STATUS_CODE: (state, action) => {
      if (isActionOfType(action, 'SET_STATUS_CODE')) {
        return action.payload.code;
      }

      return state;
    },
  },
  200,
);

export const redirectionUrlReducer = createReducerForStoreKey<'redirectionUrl'>(
  {
    SET_STATUS_CODE: (state, action) => {
      if (isActionOfType(action, 'SET_STATUS_CODE')) {
        if (action.payload.code === 301 || action.payload.code === 302) {
          return action.payload.redirectTo;
        } else {
          return null;
        }
      }

      return state;
    },
  },
  null,
);

export const getStatusCode = (state: StoreState) => state.statusCode;
export const getRedirectionUrl = (state: StoreState) => state.redirectionUrl;
