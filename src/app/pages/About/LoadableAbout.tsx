import loadable from 'react-loadable';

export const LoadableAbout = loadable({
  loader: () => import('./About').then(module => module.About),
  loading: () => null,
});
