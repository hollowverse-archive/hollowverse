import { createReducerForStoreKey, isActionOfType } from 'store/helpers';
import { StoreState } from 'store/types';

export const facebookAuthResponseReducer = createReducerForStoreKey<
  'facebookAuthResponse'
>(
  {
    FACEBOOK_AUTH_RESPONSE_CHANGED: (state, action) => {
      if (isActionOfType(action, 'FACEBOOK_AUTH_RESPONSE_CHANGED')) {
        return action.payload || null;
      }

      return state;
    },
  },
  null,
);

export const isUserAuthenticated = (state: StoreState) =>
  !!state.facebookAuthResponse;

export const getAccessToken = (state: StoreState) =>
  state.facebookAuthResponse ? state.facebookAuthResponse.accessToken : null;
