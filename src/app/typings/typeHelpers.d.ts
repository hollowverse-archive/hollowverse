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
  ? T
  : { [P in keyof T]?: T[P] extends NonPartialable ? T[P] : DeepPartial<T[P]> };
