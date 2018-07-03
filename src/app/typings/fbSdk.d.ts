declare const FB: facebookSdk.Fb;

declare namespace facebookSdk {
  type AuthResponse = LoginStatusResponse['authResponse'];

  type LoginStatusResponse =
    | {
        /** The user is logged into Facebook and has authorized your application. */
        status: 'connected';
        authResponse: {
          accessToken: string;
          /** In seconds */
          expiresIn: number;
          signedRequest: any;
          userID: string;
        };
      }
    | {
        /** The user is logged into Facebook but has not authorized your application. */
        status: 'not_authorized';
        authResponse: null | undefined;
      }
    | {
        /**
         * The user has previously logged into your application but your
         * authorization to access their data has expired.
         */
        status: 'authorization_expired';
        authResponse: null | undefined;
      }
    | {
        /**
         * The user is either not logged into Facebook or explicitly logged out of your
         * application so it doesn't attempt to connect to Facebook and thus,
         * we don't know if they've authenticated your application or not.
         */
        status: 'unknown';
        authResponse: null | undefined;
      };

  type LoginStatus = LoginStatusResponse['status'];

  type EventTypeToResponse = {
    /**
     * Fired when the `authResponse` object has changed,
     * which indicates that the user's access token has changed in some way.
     */
    'auth.authResponseChange': LoginStatusResponse;
    /**
     * Fired when the user's Facebook Login status changes.
     */
    'auth.statusChange': LoginStatusResponse;
    /**
     * Fired when someone logs into the app using `FB.login()`.
     * It is preferable to use the `'auth.statusChange'` event for this purpose.
     */
    'auth.login': AuthResponse;
    /**
     * Fired when someone logs out of the app using `FB.logout()`.
     * It is preferable to use the `'auth.statusChange'` event for this purpose.
     */
    'auth.logout': AuthResponse;
    /**
     * Fired when `FB.XFBML.parse()` completes.
     * This indicates that all of the social plugins on the page have been loaded.
     */
    'xfbml.render': undefined;
  };

  type EventType = keyof EventTypeToResponse;

  type Callback<T> = (response: T) => void;

  type EventResponse<T extends EventType> = EventTypeToResponse[T];

  interface Fb {
    Event: {
      subscribe<T extends EventType>(
        eventToSubscribeTo: T,
        callback: Callback<EventResponse<T>>,
      ): void;

      unsubscribe<T extends EventType>(
        event: EventType,
        callback: Callback<EventResponse<T>>,
      ): void;
    };

    XFBML: {
      parse(node?: Node, callback?: () => void): void;
    };

    getLoginStatus(
      callback: Callback<LoginStatusResponse>,
      cache?: boolean,
    ): void;

    getAuthResponse(): AuthResponse;

    login(callback?: Callback<AuthResponse>): void;
    logout(callback?: Callback<AuthResponse>): void;

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
