import { EventEmitter } from 'events';
import { once } from 'lodash';

export type Cancelable<T> = Readonly<{
  promise: Promise<T>;
  wasCanceled: boolean;
  cancel(): void;
}>;

type CancelRejection = Readonly<{ isCanceled: true }>;

const cancelRejection = Object.freeze<CancelRejection>({ isCanceled: true });

export function promiseToCancelable<T>(promise: Promise<T>): Cancelable<T> {
  let wasCanceled = false;

  const target = new EventEmitter();
  const cancelationPromise = new Promise<T>((_, reject) => {
    target.once('cancel', () => {
      wasCanceled = true;
      reject(cancelRejection);
    });
  });

  const wrappedPromise = Promise.race([cancelationPromise, promise]);

  return {
    promise: wrappedPromise,
    get wasCanceled() {
      return wasCanceled;
    },
    cancel: once(() => {
      target.emit('cancel');
    }),
  };
}

export function isCancelRejection(obj: any): obj is CancelRejection {
  return obj === cancelRejection;
}
