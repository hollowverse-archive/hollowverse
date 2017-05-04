import {HvError} from '../../../typings/typeDefinitions'

export const errors: {[code: string]: HvError} = {
  facebookLoginError: {
    code: 'facebookLoginError',
    message: 'We could not complete login to Hollowverse through Facebook',
  },
  firebaseLoginError: {
    code: 'firebaseLoginError',
    message: 'We could get you logged-in successfully. Please try again, and we will be on the case!',
  },
}
