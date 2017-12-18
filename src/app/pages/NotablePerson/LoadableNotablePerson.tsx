import universal from 'react-universal-component';
import { Props } from './NotablePerson';

export const LoadableNotablePerson = universal<Props>(
  import('./NotablePerson'),
  {
    key: module => module.NotablePerson,
  },
);
