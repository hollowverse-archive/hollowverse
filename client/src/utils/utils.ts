import * as cn from 'classnames';
import sortBy from 'lodash/sortBy';
import { messagesByCode } from 'constants/errors';
import { ErrorCode, HvError } from 'typings/typeDefinitions';
import { EventSchema, EventWithQuoteSchema } from 'typings/dataSchema';

export function stringEnum<T extends string>(o: T[]): { [K in T]: K } {
  return o.reduce((res, key) => {
    res[key] = key;

    return res;
  }, Object.create(null));
}

export function sortByDescending<T>(
  object: { [index: number]: T; length: number },
  iteratee: string,
): T[] {
  return sortBy(object, iteratee).reverse();
}

export function promisify<R>(
  fn: (cb: (result: R, err?: Error | null) => void) => void,
) {
  return () =>
    new Promise<R>((resolve, reject) => {
      const _fn: typeof fn = fn.bind(fn);
      _fn((result, err) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
}

/**
 * A helper function to create an custom error
 * instance given a valid error code
 */
export function makeError(code: ErrorCode): HvError {
  const message = messagesByCode[code];
  const error = new Error(message) as HvError;
  error.name = 'HollowverseError';
  error.code = code;

  return error;
}

/**
 * A type guard that guarantees that an Event has a quote, providing
 * better control flow analysis and type checking for TypeScript.
 */
export function doesEventHaveQuote(
  ev: EventSchema,
): ev is EventWithQuoteSchema {
  return (ev as EventWithQuoteSchema).quote !== undefined;
}

export { cn };
