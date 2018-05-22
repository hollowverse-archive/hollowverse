import { DeepPartial } from 'typings/typeHelpers';

export type ErrorResult = {
  state: 'error';
  value: undefined;
  error?: Error;
};

type StaleResult<T> = {
  state: 'stale';
  value: T;
};

type OptimisticResult<T> = {
  state: 'optimistic';
  value: DeepPartial<T>;
};

export type PendingResult = {
  state: 'pending';
  value: undefined;
};

export type SuccessResult<T> = {
  state: 'success';
  value: T;
};

export type AsyncResult<T> =
  | ErrorResult
  | PendingResult
  | StaleResult<T>
  | OptimisticResult<T>
  | SuccessResult<T>;

export const pendingResult: PendingResult = {
  state: 'pending',
  value: undefined,
};

export const errorResult: ErrorResult = {
  state: 'error',
  value: undefined,
};

export const nullResult: SuccessResult<null> = {
  state: 'success',
  value: null,
};

export function isErrorResult<T>(
  result: AsyncResult<T>,
): result is ErrorResult {
  return result.state === 'error';
}

export function isPendingResult<T>(
  result: AsyncResult<T>,
): result is PendingResult {
  return result.state === 'pending';
}

export function isOptimisticResult<T>(
  result: AsyncResult<T | null>,
): result is OptimisticResult<T> {
  return result.state === 'optimistic';
}

export function isStaleResult<T>(
  result: AsyncResult<T>,
): result is StaleResult<T> {
  return result.state === 'stale';
}

export function isSuccessResult<T>(
  result: AsyncResult<T>,
): result is SuccessResult<T> {
  return result.state === 'success';
}

export async function promiseToAsyncResult<T>(
  promise: Promise<T>,
): Promise<ErrorResult | SuccessResult<T>> {
  try {
    const value = await promise;

    return {
      value,
      state: 'success',
    };
  } catch (e) {
    return {
      value: undefined,
      state: 'error',
    };
  }
}
