import universal from 'react-universal-component';

export const LoadablePrivacyPolicy = universal(import('./PrivacyPolicy'), {
  key: module => module.PrivacyPolicy,
});
