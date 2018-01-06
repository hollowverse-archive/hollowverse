/** Whether the `DEBUG` flag has been passed to the CLI start command */
declare const __IS_DEBUG__: boolean;

/**
 * `true` if the code is running in Node.js (server-side rendering),
 * `false` otherwise
 */
declare const __IS_SERVER__: boolean;

/** Git branch of the current build, or `undefined` for development */
declare const __BRANCH__: string | undefined;

/** Git commit hash of the current build, or `undefined` for development */
declare const __COMMIT_ID__: string | undefined;

/**
 * The base URL of the current app server,
 * i.e. https://hollowvese.com for production or
 * http://localhost:3001 for development
 */
declare const __BASE__: string;

/** @example https://api.hollowverse.com/graphql */
declare const __API_ENDPOINT__: string;

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
