import isPlainObject from 'lodash/isPlainObject';
import { LogRequestBody, LogType } from './types';

/**
 * Determines if the request body coming from a client is valid as a log event.
 * Note: This is implemented as a TypeScript type guard, i.e. if the returned value
 * is `true`, TypeScript will consider assign the `LogRequestBody` type to the parameter.
 */
export function isBodyValid(body: any): body is LogRequestBody<LogType> {
  return (
    isPlainObject(body) &&
    typeof (body as LogRequestBody<LogType>).event === 'string' &&
    isPlainObject((body as LogRequestBody<LogType>).payload)
  );
}
