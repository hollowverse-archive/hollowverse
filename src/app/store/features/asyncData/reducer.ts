import { createReducerForStoreKey, isActionOfType } from 'store/helpers';
import { nullResult } from 'helpers/asyncResults';

export const resolvedDataReducer = createReducerForStoreKey<'resolvedData'>(
  {
    SET_RESOLVED_DATA: (state, action) => {
      if (isActionOfType(action, 'SET_RESOLVED_DATA')) {
        return {
          ...state,
          [action.payload.key]: {
            ...action.payload.data,
          },
        };
      }

      return state;
    },
  },
  {
    notablePersonQuery: {
      ...nullResult,
      requestId: null,
    },
    searchResults: {
      ...nullResult,
      requestId: null,
    },
  },
);
