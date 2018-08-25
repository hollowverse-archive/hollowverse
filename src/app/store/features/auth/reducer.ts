import { isActionOfType } from 'store/helpers';
import {
  StoreState,
  AuthenticationState,
  Reducer,
  AuthorizationState,
} from 'store/types';
import { createSelector } from 'reselect';
import { getResolvedDataForKey } from '../asyncData/selectors';
import { isPendingResult, isSuccessResult } from 'helpers/asyncResults';
import { UserRole, ViewerQuery } from 'api/types';

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

export const getFbSdkAuthenticationState = (state: StoreState) =>
  state.fbSdkAuthState;

export const getAccessToken = createSelector(
  getFbSdkAuthenticationState,
  fbAuthState =>
    fbAuthState.state === 'loggedIn' ? fbAuthState.accessToken : null,
);

export const getViewerResult = createSelector(getResolvedDataForKey, get =>
  get('viewer'),
);

/**
 * The final authentication state depends on both Facebook SDK authentication state
 * and the result of the `viewer` API query.
 * A successful authentication is a combination of a successful Facebook login
 * and a successful, non-`null` `viewer` API query.
 */
export const getAuthenticationState = createSelector(
  getViewerResult,
  getFbSdkAuthenticationState,
  (viewerQueryResult, fbAuthState): AuthenticationState => {
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

const doesViewerHaveOneOfRoles = (
  viewer: NonNullable<ViewerQuery['viewer']>,
  requiredRoles?: UserRole[],
) => {
  if (requiredRoles === undefined) {
    return true;
  }

  const { role } = viewer;

  return role !== null && requiredRoles.includes(role);
};

export const getAuthorizationState = createSelector(
  getAuthenticationState,
  authState => (requiredRoles?: UserRole[]): AuthorizationState => {
    if (authState.state !== 'loggedIn') {
      return authState;
    }

    return {
      state: doesViewerHaveOneOfRoles(authState.viewer, requiredRoles)
        ? 'authorized'
        : 'notAuthorized',
    };
  },
);
