import createLruCache, { Options } from 'lru-cache';

/**
 * Executes an asynchronous function and caches the result only if
 * the promise returned from the function does not reject.
 */
export const memoizeOnSuccess = <T extends string, R>(
  fn: ((arg: T) => Promise<R>),
  cacheOptions: Pick<Options, 'max' | 'maxAge'> = {
    max: 10000,
    maxAge: 43200000,
  },
) => {
  const cache = createLruCache<string, R>(cacheOptions);

  return async (arg: T) => {
    const cachedResult = cache.get(arg);
    if (cachedResult !== undefined) {
      return cachedResult;
    }

    const result = await fn(arg);
    cache.set(arg, result);

    return result;
  };
};
