import loadable from 'react-loadable';

export const LoadableHome = loadable({
  loader: async () => import('./Home').then(module => module.Home),
  loading: () => null,
});
