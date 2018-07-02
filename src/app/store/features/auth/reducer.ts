import { createReducerForStoreKey, isActionOfType } from 'store/helpers';
import { StoreState } from 'store/types';

export const facebookAuthResponseReducer = createReducerForStoreKey<
  'facebookAuthResponse'
>(
  {
    FACEBOOK_AUTH_TOKEN_CHANGED: (state, action) => {
      if (isActionOfType(action, 'FACEBOOK_AUTH_TOKEN_CHANGED')) {
        return action.payload || null;
      }

      return state;
    },
  },
  null,
);

export const isUserAuthenticated = (state: StoreState) =>
  !!state.facebookAuthResponse;
