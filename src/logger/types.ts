import { Action } from '../app/store/types';

export type LoggedAction = Action & {
  timestamp: string;
  sessionId: string;
  userAgent?: string;
};
