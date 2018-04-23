import loadable from 'react-loadable';
import { loadableDefaultOptions } from 'helpers/loadableDefaultOptions';

export const LoadablePrivacyPolicy = loadable({
  ...loadableDefaultOptions,
  loader: async () =>
    import('./PrivacyPolicy').then(module => module.PrivacyPolicy),
});
