export interface User {
  displayName: string | null,
  id: string
}

interface IHvError {
  code: string,
  message: string // end-user friendly error message
}

export type HvError = IHvError | undefined
