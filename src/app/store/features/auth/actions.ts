import { createActionCreator } from 'store/helpers';

export const requestLogin = createActionCreator('REQUEST_LOGIN');
export const requestLogout = createActionCreator('REQUEST_LOGOUT');

export const setFbSdkAuthState = createActionCreator('SET_FB_SDK_AUTH_STATE');

export const facebookAuthResponseChanged = createActionCreator(
  'FACEBOOK_AUTH_RESPONSE_CHANGED',
);
