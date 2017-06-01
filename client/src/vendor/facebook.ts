import {errors} from '../constants/errors'

const promisifier = (method: any) => {
  return () => {
    return new Promise((resolve, reject) => {
      method((results: any, err: any) => {
        if (err) {
          reject(err)
        } else {
          resolve(results)
        }
      })
    })
  }
}

export function getLoginStatus(): Promise<facebookSdk.IAuthResponse> {
  try {
    const response = promisifier(FB.getLoginStatus)
    const status = response().then((results: facebookSdk.IAuthResponse) => {
      return results
    })
    return status
  } catch (err) {
    throw err
  }
}

export function login(): Promise<facebookSdk.IAuthResponse> {
  try {
    const response = promisifier(FB.getLoginStatus)
    const status = response().then((results: facebookSdk.IAuthResponse) => {
      return results
    })
    return status
  } catch (err) {
    throw err
  }
}

/*
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
*/

/*
export async function getLoginStatus() {
  try {
    const response = await promisifier(FB.getLoginStatus())
    response.then((results) => {
      console.log(results)
    })

    return response
  } catch (err) {
    throw err
  }
}

*/

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
