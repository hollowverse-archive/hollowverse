type UnboxPromise<T> = T extends Promise<infer R> ? R : T;

type ArrayElement<T extends any[]> = T extends Array<infer R> ? R : never;
