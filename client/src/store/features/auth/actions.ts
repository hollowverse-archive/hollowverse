import { createActionCreator } from 'store/helpers';

export const requestLogin = createActionCreator('requestLogin');
export const setLoginStatus = createActionCreator('setLoginStatus');
export const requestUpdateLoginStatus = createActionCreator(
  'requestUpdateLoginStatus',
);
export const setIsLoginPending = createActionCreator('setIsLoginPending');
export const setIsLogoutPending = createActionCreator('setIsLogoutPending');
export const requestLogout = createActionCreator('requestLogout');
export const setUserData = createActionCreator('setUserData');
