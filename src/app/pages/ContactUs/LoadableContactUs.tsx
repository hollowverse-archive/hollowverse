import loadable from 'react-loadable';
import { loadableDefaultOptions } from 'helpers/loadableDefaultOptions';

export const LoadableContactUs = loadable({
  ...loadableDefaultOptions,
  loader: async () => import('./ContactUs').then(module => module.ContactUs),
});
