import universal from 'react-universal-component';

export const LoadableNotablePerson = universal(import('./NotablePerson'), {
  key: module => module.NotablePerson,
});
