import {errors} from '../constants/errors'
import {promisify} from '../utils/utils'

FB.getLoginStatus = promisify(FB.getLoginStatus)
FB.login = promisify(FB.login)
FB.logout = promisify(FB.logout)
FB.init = promisify(FB.init)

export async function getLoginStatus(): Promise<void> {
  try {
    return await FB.getLoginStatus()
  } catch (err) {
    throw err
  }
}

export async function login(): Promise<void> {
  try {
    return await FB.login()
  } catch (err) {
    throw err
  }
}

export async function logout(): Promise<void> {
  try {
    return await FB.logout()
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
