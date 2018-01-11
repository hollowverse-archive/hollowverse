import { Action } from 'store/types';

export type LoggedAction = Action & {
  timestamp: string;
  isServer: boolean;
};
