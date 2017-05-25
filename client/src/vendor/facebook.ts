import {errors} from '../constants/errors'

/*
export function getLoginStatus() {
  return new Promise<facebookSdk.IAuthResponse>((resolve) => {
    FB.getLoginStatus((response) => {
      resolve(response)
    })
  })
}
*/

// WIP: saga doesn't like the response.
export async function getLoginStatus() {
  try {
    return await FB.getLoginStatus((response) => {
      return response
    })
  } catch (err) {
    throw err
  }
}

/*
export function login() {
  return new Promise<facebookSdk.IAuthResponse>((resolve, reject) => {
    FB.login((response) => {
      if (response.authResponse) {
        resolve(response)
      } else {
        reject(errors.facebookLoginError)
      }
    })
  })
}
*/

// WIP: untested
export async function login() {
  try {
    return await FB.login((response) => {
      if (response.authResponse) {
        return response
      } else {
        return errors.facebookLoginError
      }
    })
  } catch (err) {
    throw err
  }
}
/*
export function logout() {
  return new Promise<facebookSdk.IAuthResponse>((resolve) => {
    FB.logout((response) => {
      resolve(response)
    })
  })
}
*/

// WIP: untested
export async function logout() {
  try {
    return await FB.logout((response) => {
      return response
    })
  } catch (err) {
    throw err
  }
}

/*
export function initSdk() {
  return new Promise<void>((resolve) => {
    FB.init({
      appId: '1151099935001443',
      xfbml: true,
      version: 'v2.8',
      cookie: true,
    })

    resolve()
  })
}
*/

// Status: OK
export async function initSdk() {
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
