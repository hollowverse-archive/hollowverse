export type ErrorResult = {
  isInProgress: false;
  hasError: true;
  value: null;
};

type OptimisticResult<T> = {
  isInProgress: true;
  hasError: false;
  value: T;
};

type PendingResult = {
  isInProgress: true;
  hasError: false;
  value: null;
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
  result: AsyncResult<T>,
): result is OptimisticResult<T> {
  return result.value !== null && result.isInProgress === true;
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
      value: null,
      isInProgress: false,
      hasError: true,
    };
  }
}
