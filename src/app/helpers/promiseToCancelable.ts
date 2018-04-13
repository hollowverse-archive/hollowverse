import { EventEmitter } from 'events';

export type Cancelable<T> = Readonly<{
  promise: Promise<T>;
  wasCanceled: boolean;
  cancel(): void;
}>;

type CancelRejection = Readonly<{ isCanceled: true }>;

const cancelError: CancelRejection = { isCanceled: true };

export function promiseToCancelable<T>(promise: Promise<T>): Cancelable<T> {
  let wasCanceled = false;

  const target = new EventEmitter();
  const cancelationPromise = new Promise<T>((_, reject) => {
    target.on('cancel', () => {
      wasCanceled = true;
      reject(cancelError);

      return false;
    });
  });

  const wrappedPromise = Promise.race([cancelationPromise, promise]);

  return {
    promise: wrappedPromise,
    get wasCanceled() {
      return wasCanceled;
    },
    cancel() {
      target.emit('cancel');
    },
  };
}

export function isCancelRejection(obj: any): obj is CancelRejection {
  return 'isCanceled' in obj && obj.isCanceled === true;
}
