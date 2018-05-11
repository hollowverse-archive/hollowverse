declare module 'p-memoize' {
  type MemoizeOptions = {
    /**
     * Milliseconds until the cache expires.
     * @default `Infinity`
     */
    maxAge?: number;
  };
  type Memoize = <T extends (...args: any[]) => any>(
    f: T,
    memoizeOptions?: MemOptions,
  ) => T;

  const pMemoize: Memoize;

  export = pMemoize;
}
