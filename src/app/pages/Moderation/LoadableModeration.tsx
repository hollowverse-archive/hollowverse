import loadable from 'react-loadable';
import { loadableDefaultOptions } from 'helpers/loadableDefaultOptions';

export const LoadableModeration = loadable({
  ...loadableDefaultOptions,
  loader: async () => import('./Moderation').then(module => module.Moderation),
});
