declare const FB: facebookSdk.Fb;
declare namespace facebookSdk {
  type LoginStatus = 'connected' | 'not_authorized' | 'unknown';

  interface AuthResponseWithoutStatus {
    accessToken: string;
    expiresIn: number;
    signedRequest: any;
    userID: string;
  }

  interface AuthResponse {
    status: LoginStatus;
    authResponse: AuthResponseWithoutStatus;
  }

  interface Fb {
    Event: {
      subscribe(
        eventToSubscribeTo: 'auth.statusChange',
        callback: (response: AuthResponse) => any,
      ): void;
    };
    getLoginStatus(
      callback: (response: AuthResponse) => any,
      cache?: boolean,
    ): void;
    login(callback: (response: AuthResponse) => void): void;
    logout(callback: (response: AuthResponse) => void): void;
    init(params?: {
      appId?: string;
      xfbml?: boolean;
      autoLogAppEvents?: boolean;
      status?: boolean;
      version?: string;
      cookie?: boolean;
    }): void;
  }
}
