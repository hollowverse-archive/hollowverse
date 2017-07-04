import * as cn from 'classnames';
import sortBy from 'lodash/sortBy';
import { ErrorCode, messagesByCode, HvError } from 'constants/errors';

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
  const error = new HvError(messagesByCode[code]);
  error.code = code;

  return error;
}

export { cn };
