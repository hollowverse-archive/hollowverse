declare module 'lodash/zipObject' {
  const zipObject: <K extends string, V>(
    keys: K[],
    values: V[],
  ) => Record<K, V>;
  export default zipObject;
}

declare module 'lodash/mapValues' {
  const mapValues: <K extends string, V, M>(
    obj: Record<K, V>,
    mapper: (v: V, k: K) => M,
  ) => Record<K, M>;
  export default mapValues;
}

declare module 'lodash/pick' {
  function pick<K extends string, T extends Record<K, any>>(
    obj: T,
    ...args: K[]
  ): Pick<T, K>;
  function pick<K extends string, T extends Record<K, any>>(
    obj: T,
    keys: K[],
  ): Pick<T, K>;

  export default pick;
}

declare module 'lodash/pickBy' {
  const pickBy: <T extends Record<string, any>, K extends keyof T>(
    obj: T,
    iteratee: (v: T, k: K) => boolean,
  ) => Pick<T, K>;
  export default pickBy;
}

declare module 'lodash/countBy' {
  const countBy: <T>(array: T[], el: T) => Record<'true' | 'false', number>;
  export default countBy;
}
