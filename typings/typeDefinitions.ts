export interface IUser {
  displayName: string | null;
  id: string;
}

export abstract class HvError extends Error {
  name: string;
  code: string;
  /** User-friendly error message */
  message: string;
}
