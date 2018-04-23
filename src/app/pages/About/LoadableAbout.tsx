import loadable from 'react-loadable';
import { loadableDefaultOptions } from 'helpers/loadableDefaultOptions';

export const LoadableAbout = loadable({
  ...loadableDefaultOptions,
  loader: async () => import('./About').then(module => module.About),
});
