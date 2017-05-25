import {errors} from '../constants/errors'

export async function getLoginStatus() {
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

export async function login() {
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

export async function logout(): Promise<facebookSdk.IAuthResponse | void> {
  try {
    return await FB.logout((response) => {
      return response
    })
  } catch (err) {
    throw err
  }
}

export async function initSdk(): Promise<void> {
  try {
    return await FB.init({
      appId: '1151099935001443',
      xfbml: true,
      version: 'v2.8',
      cookie: true,
    })
  } catch (err) {
    throw err
  }
}
