declare const __IS_DEBUG__: boolean;
declare const __IS_SERVER__: boolean;
declare const __BRANCH__: string | undefined;
declare const __COMMIT_ID__: string | undefined;

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

    XFBML: {
      parse(node?: Node, callback?: () => void): void;
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
