import universal from 'react-universal-component';
import { Props } from './NotablePerson';
import { NotablePersonBody } from './NotablePersonBody';

export const LoadableNotablePerson = universal<Props>(
  import('./NotablePerson'),
  {
    key: module => module.NotablePerson,
    loading: NotablePersonBody,
  },
);
