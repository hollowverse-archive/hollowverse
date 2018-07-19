/* tslint:disable */
const FB: FB;

interface FB {
  Event: {
    subscribe<T extends FB.EventType>(
      eventToSubscribeTo: T,
      callback: FB.Callback<FB.EventResponse<T>>,
    ): void;

    unsubscribe<T extends FB.EventType>(
      event: EventType,
      callback: FB.Callback<FB, EventResponse<T>>,
    ): void;
  };

  XFBML: {
    parse(node?: Node, callback?: () => void): void;
  };

  getLoginStatus(
    callback: FB.Callback<FB.LoginStatusResponse>,
    cache?: boolean,
  ): void;

  getAuthResponse(): FB.AuthResponse;

  login(callback?: FB.Callback<FB.AuthResponse>): void;
  logout(callback?: FB.Callback<FB.AuthResponse>): void;

  init(params?: {
    appId?: string;
    xfbml?: boolean;
    autoLogAppEvents?: boolean;
    status?: boolean;
    version?: string;
    cookie?: boolean;
  }): void;
}

declare namespace FB {
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
}
