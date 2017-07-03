import { makeError } from 'constants/errors';

export function getLoginStatus() {
  return new Promise<facebookSdk.IAuthResponse>(resolve => {
    FB.getLoginStatus(response => {
      resolve(response);
    });
  });
}

export function login() {
  return new Promise<facebookSdk.IAuthResponse>((resolve, reject) => {
    FB.login(response => {
      if (response.authResponse) {
        resolve(response);
      } else {
        reject(makeError('facebookLoginError'));
      }
    });
  });
}

export function logout() {
  return new Promise<facebookSdk.IAuthResponse>(resolve => {
    FB.logout(response => {
      resolve(response);
    });
  });
}

export async function initSdk() {
  FB.init({
    appId: '1151099935001443',
    xfbml: true,
    version: 'v2.8',
    cookie: true,
  });
}
