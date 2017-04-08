interface Window {
  __REDUX_DEVTOOLS_EXTENSION_COMPOSE__: Function,
  __PRELOADED_STATE__: {}
}

declare const FB: facebookSdk.Ifb
declare namespace facebookSdk {
  type LoginStatus = 'connected' | 'not_authorized' | 'unknown'

  type AuthResponseWithoutStatus = {
    accessToken: string,
    expiresIn: number,
    signedRequest: any,
    userID: string,
  }

  interface AuthResponse {
    status: LoginStatus,
    authResponse: AuthResponseWithoutStatus
  }

  interface Ifb {
    Event: {
      subscribe(eventToSubscribeTo: 'auth.statusChange',
                 callback: (response: AuthResponse) => any): void,
    },
    getLoginStatus(callback: (response: AuthResponse) => any, cache?: boolean): void
    login(callback: (response: AuthResponse) => void): void
    logout(callback: (response: AuthResponse) => void): void
    init(params: {appId: string, xfbml: boolean, status?: boolean, version: string, cookie: boolean}): void,
  }
}
