import loadable from 'react-loadable';

export const LoadablePrivacyPolicy = loadable({
  loader: () =>
    import('./PrivacyPolicy').then(({ PrivacyPolicy }) => PrivacyPolicy),
  loading: () => null,
});
