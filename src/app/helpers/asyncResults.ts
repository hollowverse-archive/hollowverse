export type ErrorResult = {
  isInProgress: false;
  hasError: true;
  value: undefined;
};

type OptimisticResult<T> = {
  isInProgress: true;
  hasError: false;
  value: T;
};

export type PendingResult = {
  isInProgress: true;
  hasError: false;
  value: undefined;
};

export type SuccessResult<T> = {
  isInProgress: false;
  hasError: false;
  value: T;
};

export type AsyncResult<T> =
  | ErrorResult
  | PendingResult
  | OptimisticResult<T>
  | SuccessResult<T>;

export const pendingResult: PendingResult = {
  isInProgress: true,
  hasError: false,
  value: undefined,
};

export const errorResult: ErrorResult = {
  isInProgress: false,
  hasError: true,
  value: undefined,
};

export const nullResult: SuccessResult<null> = {
  isInProgress: false,
  hasError: false,
  value: null,
};

export function isErrorResult<T>(
  result: AsyncResult<T>,
): result is ErrorResult {
  return result.hasError === true;
}

export function isPendingResult<T>(
  result: AsyncResult<T>,
): result is PendingResult {
  return result.hasError === false && result.isInProgress === true;
}

export function isOptimisticResult<T>(
  result: AsyncResult<T | null>,
): result is OptimisticResult<T> {
  return (
    result.value !== null &&
    result.hasError === false &&
    result.isInProgress === true
  );
}

export function isSuccessResult<T>(
  result: AsyncResult<T>,
): result is SuccessResult<T> {
  return (
    result.hasError === false &&
    result.isInProgress === false &&
    result.value !== undefined
  );
}

export async function promiseToAsyncResult<T>(
  promise: Promise<T>,
): Promise<ErrorResult | SuccessResult<T>> {
  try {
    const value = await promise;

    return {
      value,
      isInProgress: false,
      hasError: false,
    };
  } catch (e) {
    return {
      value: undefined,
      isInProgress: false,
      hasError: true,
    };
  }
}
