import universal from 'react-universal-component';
import { Props } from './NotablePerson';
import { NotablePersonSkeleton } from './NotablePersonSkeleton';

export const LoadableNotablePerson = universal<Props>(
  import('./NotablePerson'),
  {
    key: module => module.NotablePerson,
    loading: NotablePersonSkeleton,
  },
);
