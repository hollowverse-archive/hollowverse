import universal from 'react-universal-component';

export const LoadableNotablePerson = universal(import('./NotablePerson'), {
  key: 'NotablePerson',
});
