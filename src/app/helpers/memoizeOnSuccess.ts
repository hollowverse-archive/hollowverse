/**
 * Executes an asynchronous function and caches the result only if
 * the promise returned from the function does not reject.
 */
export const memoizeOnSuccess = <T extends string, R>(
  fn: ((arg: T) => Promise<R>),
) => {
  const map = new Map<string, R>();

  return async (arg: T) => {
    const cachedResult = map.get(arg);
    if (cachedResult !== undefined) {
      return cachedResult;
    }

    const result = await fn(arg);
    map.set(arg, result);

    return result;
  };
};
