import { EventEmitter } from 'events';
import { once } from 'lodash';

export type Cancelable<T> = Readonly<{
  promise: Promise<T>;
  wasCanceled: boolean;
  cancel(): void;
}>;

class CancelationError extends Error {
  name = 'CancelationError';
}

export function promiseToCancelable<T>(promise: Promise<T>): Cancelable<T> {
  let wasCanceled = false;

  const target = new EventEmitter();

  const cancelationPromise = new Promise<T>((_, reject) => {
    target.addListener('cancel', () => {
      wasCanceled = true;
      reject(new CancelationError());
    });
  });

  const wrappedPromise = Promise.race([cancelationPromise, promise]).finally(
    () => {
      target.removeAllListeners();
    },
  );

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

export function isCancelRejection(obj: any): obj is CancelationError {
  return obj instanceof CancelationError;
}
