import universal from 'react-universal-component';

export const LoadableHome = universal(import('./Home'), {
  key: module => module.Home,
});
