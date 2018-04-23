import loadable from 'react-loadable';

export const LoadablePrivacyPolicy = loadable({
  loader: async () =>
    import('./PrivacyPolicy').then(module => module.PrivacyPolicy),
  loading: () => null,
});
