export interface User {
  displayName: string | null;
  id: string;
}

export type ErrorCode = 'facebookLoginError' | 'firebaseLoginError';

/**
 * A custom error class for app-specific errors
 * like authentication and data fetching errors.
 *
 * It is always a good practice to throw actual
 * Error objects so we can get stack traces in cases
 * where we throw an error and forget to catch it somewhere
 * in our code.
 */
export interface HvError extends Error {
  name: 'HollowverseError';
  code: ErrorCode;
  message: string;
}
