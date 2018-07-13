import { isActionOfType } from 'store/helpers';
import { StoreState, AuthState, Reducer } from 'store/types';
import { createSelector } from 'reselect';
import { getResolvedDataForKey } from '../asyncData/selectors';
import { isPendingResult, isSuccessResult } from 'helpers/asyncResults';

export const fbSdkAuthStateReducer: Reducer<StoreState['fbSdkAuthState']> = (
  state,
  action,
) => {
  if (isActionOfType(action, 'SET_FB_SDK_AUTH_STATE')) {
    return action.payload;
  }

  if (isActionOfType(action, 'FACEBOOK_AUTH_RESPONSE_CHANGED')) {
    if (action.payload) {
      const { accessToken } = action.payload;

      return { state: 'loggedIn', accessToken };
    }

    return { state: 'loggedOut' };
  }

  if (isActionOfType(action, 'REQUEST_LOGOUT')) {
    return { state: 'loggingOut' };
  }

  return (
    state || {
      state: 'initializing',
    }
  );
};

export const getFbSdkAuthState = (state: StoreState) => state.fbSdkAuthState;

export const getAccessToken = createSelector(
  getFbSdkAuthState,
  fbAuthState =>
    fbAuthState.state === 'loggedIn' ? fbAuthState.accessToken : null,
);

export const getViewerResult = createSelector(getResolvedDataForKey, get =>
  get('viewer'),
);

export const getAuthState = createSelector(
  getViewerResult,
  getFbSdkAuthState,
  (viewerQueryResult, fbAuthState): AuthState => {
    if (fbAuthState.state !== 'loggedIn') {
      return fbAuthState;
    }

    if (isPendingResult(viewerQueryResult)) {
      return { state: 'loggingIn' };
    }

    if (
      isSuccessResult(viewerQueryResult) &&
      viewerQueryResult.value.viewer !== null
    ) {
      return { state: 'loggedIn', viewer: viewerQueryResult.value.viewer };
    }

    return { state: 'error' };
  },
);
