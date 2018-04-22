import loadable from 'react-loadable';

export const LoadableAbout = loadable({
  loader: () => import('./About').then(({ About }) => About),
  loading: () => null,
});
