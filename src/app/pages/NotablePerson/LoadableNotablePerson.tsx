import loadable from 'react-loadable';
// import { NotablePersonBody } from './NotablePersonBody';

export const LoadableNotablePerson = loadable({
  loader: () => import('./NotablePerson').then(module => module.NotablePerson),
  loading: () => null,
});
