import loadable from 'react-loadable';

export const LoadableAbout = loadable({
  loader: async () => import('./About').then(module => module.About),
  loading: () => null,
});
