import loadable from 'react-loadable';
import { loadableDefaultOptions } from 'helpers/loadableDefaultOptions';

export const LoadableHome = loadable({
  ...loadableDefaultOptions,
  loader: async () => import('./Home').then(module => module.Home),
});
