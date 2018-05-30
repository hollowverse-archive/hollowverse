import { isPlainObject } from 'lodash';

import { LogBatch } from 'store/types';
import { DeserializedLoggedAction } from './types';

const isValidLoggedAction = (event: any): event is DeserializedLoggedAction =>
  isPlainObject(event) &&
  typeof event.type === 'string' &&
  typeof event.timestamp === 'string';

export function isValidLogBatch(
  body: any,
): body is LogBatch<DeserializedLoggedAction> {
  return (
    isPlainObject(body) &&
    typeof (body as LogBatch<any>).sessionId === 'string' &&
    Array.isArray((body as LogBatch<any>).actions) &&
    (body as LogBatch<any>).actions.length > 0 &&
    (body as LogBatch<any>).actions.every(isValidLoggedAction)
  );
}
