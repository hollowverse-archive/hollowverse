import universal from 'react-universal-component';

export const NotablePerson = universal(import('./NotablePerson'), {
  key: module => module.NotablePerson,
});
