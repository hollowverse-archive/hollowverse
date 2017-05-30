/* tslint:disable:interface-name */
interface Window {
  __REDUX_DEVTOOLS_EXTENSION_COMPOSE__: <E>(a: E) => E,
  __PRELOADED_STATE__: {}
}
/* tslint:enable:interface-name */

declare const FB: facebookSdk.Ifb
declare namespace facebookSdk {
  type LoginStatus = 'connected' | 'not_authorized' | 'unknown'

  interface IAuthResponseWithoutStatus {
    accessToken: string,
    expiresIn: number,
    signedRequest: any,
    userID: string,
  }

  interface IAuthResponse {
    status: LoginStatus,
    authResponse: IAuthResponseWithoutStatus
  }

  interface Ifb {
    Event: {
      subscribe(eventToSubscribeTo: 'auth.statusChange',
                callback: (response: IAuthResponse) => any): void,
    },
    getLoginStatus(callback: (response: IAuthResponse) => any, cache?: boolean): void
    login(callback: (response: IAuthResponse) => void): void
    logout(callback?: (response: IAuthResponse) => void): void
    init(params: {appId: string, xfbml: boolean, status?: boolean, version: string, cookie: boolean}): void,
  }
}
