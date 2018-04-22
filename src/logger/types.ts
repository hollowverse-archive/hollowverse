import { Action } from '../app/store/types';

export type LoggedAction = Action & {
  timestamp: string;
  isServer: boolean;
};
