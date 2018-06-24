export type UnboxPromise<T> = T extends Promise<infer R> ? R : T;

export type ArrayElement<T extends any[]> = T extends Array<infer R>
  ? R
  : never;

type NonPartialable =
  | (() => any)
  | undefined
  | void
  | never
  | symbol
  | string
  | number
  | any[];

export type DeepPartial<T> = T extends NonPartialable
  ? T // eslint-disable-next-line no-use-before-define
  : { [P in keyof T]?: T[P] extends NonPartialable ? T[P] : DeepPartial<T[P]> };

export type Omit<T, RemovedKeys> = Exclude<T, { [K in RemovedKeys]: T[K] }>;
