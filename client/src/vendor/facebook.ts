import { makeError } from 'constants/errors';
import { promisify } from 'utils/utils';

export const getLoginStatus = promisify(FB.getLoginStatus);

const _login = promisify(FB.login);

export async function login() {
  const response = await _login();
  if (response.authResponse) {
    return response;
  } else {
    throw makeError('facebookLoginError');
  }
}

export const logout = promisify(FB.logout);

export function initSdk() {
  return new Promise(resolve => {
    FB.Event.subscribe('auth.statusChange', response => {
      if (response.status === 'connected') {
        resolve();
      }
    });

    FB.init({
      appId: '1151099935001443',
      xfbml: true,
      version: 'v2.8',
      cookie: true,
    });
  });
}
