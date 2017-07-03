import * as cn from 'classnames';
import sortBy from 'lodash/sortBy';

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

export { cn };
