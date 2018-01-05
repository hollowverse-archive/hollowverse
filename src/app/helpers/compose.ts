/**
 * Creates a function that calls all provided functions
 * with the same arguments passed to the composed function.
 *
 * `undefined` is also accepted as an agrument for convenience.
 * This makes it handy for composing React event handlers:
 *
 * @example
 * ```typescript
 * <button onClick={compose(onClick, logClickEvent)} />
 * ```
 */
export function compose<T>(
  ...fns: Array<undefined | ((...args: T[]) => void)>
) {
  return (...args: T[]) => fns.forEach(fn => fn && fn(...args));
}
