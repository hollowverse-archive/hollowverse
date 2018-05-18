import { Action } from '../app/store/types';

export type LoggedAction = Action & {
  timestamp: string;
  sessionId: string;
  /**
   * Note: user agent cannot be read from the User-Agent header, instead
   * it must be sent in the action payload. This is because the User-Agent
   * header is not whitelisted in CloudFront so it's stripped before the request
   * is seen by the log endpoint.
   * White-listing the User-Agent header is an extremely
   * bad idea because it means a cache object will be created for every
   * browser/browser version/device combination.
   */
  userAgent?: string;
};
