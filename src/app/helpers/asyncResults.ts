type ErrorResult = {
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

type SuccessResult<T> = {
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

export async function makeResult<T>(
  promise: Promise<T>,
): Promise<AsyncResult<T>> {
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
