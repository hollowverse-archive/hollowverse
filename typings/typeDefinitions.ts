export interface IUser {
  displayName: string | null;
  id: string;
}

interface IHvError {
  code: string;
  message: string; // end-user friendly error message
}

export type HvError = IHvError | undefined;

export interface IContactFormData {
  email: string;
  name: string;
  message: string;
}
