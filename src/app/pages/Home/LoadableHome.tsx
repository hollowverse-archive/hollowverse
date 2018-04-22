import loadable from 'react-loadable';

export const LoadableHome = loadable({
  loader: () => import('./Home').then(({ Home }) => Home),
  loading: () => null,
});
