import { ResultType } from './types';

export type ApiError = {
  code: string;
  message: string;
};

type ErrorApiResult = {
  state: ResultType.ERROR;
  errors?: ApiError[];
};

type SuccessApiResult = {
  state: ResultType.SUCCESS;
};

export type ApiResult = SuccessApiResult | ErrorApiResult;

export function isErrorApiResult(result: {
  state: ResultType;
}): result is ErrorApiResult {
  return result.state === ResultType.ERROR;
}

export function isSuccessApiResult(
  result: ApiResult,
): result is SuccessApiResult {
  return result.state === ResultType.SUCCESS;
}
