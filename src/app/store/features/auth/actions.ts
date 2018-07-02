import { createActionCreator } from 'store/helpers';

export const toggleAuthStatus = createActionCreator('TOGGLE_AUTH_STATUS');
export const facebookAuthResponseChanged = createActionCreator(
  'FACEBOOK_AUTH_TOKEN_CHANGED',
);
