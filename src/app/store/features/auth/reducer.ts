import { createReducerForStoreKey, isActionOfType } from 'store/helpers';
import { StoreState } from 'store/types';

export const authTokenReducer = createReducerForStoreKey<'authToken'>(
  {
    FACEBOOK_AUTH_RESPONSE_CHANGED: (state, action) => {
      if (isActionOfType(action, 'FACEBOOK_AUTH_RESPONSE_CHANGED')) {
        return action.payload ? action.payload.accessToken : null;
      }

      return state;
    },
  },
  null,
);

export const isUserAuthenticatedToFacebook = (state: StoreState) =>
  !!state.authToken;

export const getAccessToken = (state: StoreState) =>
  state.authToken ? state.authToken : null;
