/**
 * Creates a function that calls all provided functions
 * with the same arguments passed to the new function.
 *
 * `undefined` is also accepted as an agrument for convenience.
 * This makes it handy for composing React event handlers:
 *
 * @example
 * ```typescript
 * <button onClick={callAll(onClick, logClickEvent)} />
 * ```
 */
export function callAll<T>(
  ...fns: Array<undefined | ((...args: T[]) => void)>
) {
  return (...args: T[]) => {
    fns.forEach(fn => {
      if (fn) {
        fn(...args);
      }
    });
  };
}
