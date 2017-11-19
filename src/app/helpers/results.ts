export type ErrorResult = { error: Error | any };
export type SuccessResult<T> = { data: T };
export type Result<T> = SuccessResult<T> | ErrorResult;

export function isErrorResult<T>(result: Result<T>): result is ErrorResult {
  return (result as ErrorResult).error !== undefined;
}
