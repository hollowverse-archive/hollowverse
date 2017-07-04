import { HvError as IHvError } from 'typings/typeDefinitions';

export const messagesByCode = {
  facebookLoginError:
    'We could not complete login to Hollowverse through Facebook',
  firebaseLoginError:
    'We could not get you logged-in successfully. Please try again, and we will be on the case!',
};

type ErrorCode = keyof typeof messagesByCode;

/**
 * A custom error class for app-specific errors
 * like authentication and data fetching errors.
 *
 * It is always a good practice to throw actual
 * Error objects so we can get stack traces in cases
 * where we throw an error and forget to catch it somewhere
 * in our code.
 */
export class HvError extends Error implements IHvError {
  name = 'HollowverseError';
  code: ErrorCode;
  message: string;
}

/**
 * A helper function to create an custom error
 * instance given a valid error code
 */
export function makeError(code: ErrorCode): HvError {
  const error = new HvError(messagesByCode[code]);
  error.code = code;

  return error;
}
