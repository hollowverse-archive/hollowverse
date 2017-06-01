import {errors} from '../constants/errors'

export async function getLoginStatus(): Promise<facebookSdk.IAuthResponse> {
  try {
    return await new Promise<facebookSdk.IAuthResponse>((resolve) => {
      FB.getLoginStatus((response) => {
        resolve(response)
      })
    })
  } catch (err) {
    throw err
  }
}

export async function login(): Promise<facebookSdk.IAuthResponse | Error> {
  try {
    return await new Promise<facebookSdk.IAuthResponse>((resolve, reject) => {
      FB.login((response) => {
        if (response.authResponse) {
          resolve(response)
        } else {
          reject(errors.facebookLoginError)
        }
      })
    })
  } catch (err) {
    throw err
  }
}

export function logout(): void {
  try {
    FB.logout()
  } catch (err) {
    throw err
  }
}

export function initSdk(): void {
  try {
    FB.init({
      appId: '1151099935001443',
      xfbml: true,
      version: 'v2.8',
      cookie: true,
    })
  } catch (err) {
    throw err
  }
}
