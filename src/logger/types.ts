import { Action } from '../app/store/types';

export type DeserializedLoggedAction = Action & {
  timestamp: string;
};
