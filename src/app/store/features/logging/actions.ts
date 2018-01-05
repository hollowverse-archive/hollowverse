import { LogPayload, LogType } from './types';
import { Action } from 'store/types';

export const log = <T extends LogType>(
  logType: T,
  logPayload: LogPayload<T>,
): Action<'LOG'> => {
  return {
    type: 'LOG',
    payload: {
      type: logType,
      payload: {
        timestamp: new Date(),
        // tslint:disable-next-line no-suspicious-comment
        // @FIXME: Type cast to work around TS issue
        ...(logPayload as any),
        isServer: __IS_SERVER__,
      },
    },
  };
};
