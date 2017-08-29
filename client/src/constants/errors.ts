import { ErrorCode } from 'common/types/typeDefinitions';

export const messagesByCode: Record<ErrorCode, string> = {
  facebookLoginError:
    'We could not complete login to Hollowverse through Facebook',
  firebaseLoginError:
    'We could not get you logged-in successfully. Please try again, and we will be on the case!',
};
