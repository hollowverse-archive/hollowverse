import { isPlainObject } from 'lodash';

import { LogBatch } from 'store/types';
import { LoggedAction } from './types';

const isValidLoggedAction = (event: any): event is LoggedAction =>
  isPlainObject(event) &&
  typeof event.type === 'string' &&
  typeof event.timestamp === 'string';

export function isValidLogBatch(body: any): body is LogBatch<LoggedAction> {
  return (
    isPlainObject(body) &&
    typeof (body as LogBatch<any>).sessionId === 'string' &&
    Array.isArray((body as LogBatch<any>).actions) &&
    (body as LogBatch<any>).actions.every(isValidLoggedAction)
  );
}
