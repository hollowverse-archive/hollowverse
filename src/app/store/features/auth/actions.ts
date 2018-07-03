import { createActionCreator } from 'store/helpers';

export const requestLogin = createActionCreator('REQUEST_LOGIN');
export const requestLogout = createActionCreator('REQUEST_LOGOUT');

export const facebookAuthResponseChanged = createActionCreator(
  'FACEBOOK_AUTH_RESPONSE_CHANGED',
);
