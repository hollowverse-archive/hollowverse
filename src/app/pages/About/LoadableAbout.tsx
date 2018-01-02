import universal from 'react-universal-component';

export const LoadableAbout = universal(import('./About'), {
  key: module => module.About,
});
