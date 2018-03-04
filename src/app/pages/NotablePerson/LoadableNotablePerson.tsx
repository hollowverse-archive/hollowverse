import universal from 'react-universal-component';
import { Props } from './NotablePerson';
import { NotablePersonBodySkeleton } from './NotablePersonBodySkeleton';

export const LoadableNotablePerson = universal<Props>(
  import('./NotablePerson'),
  {
    key: module => module.NotablePerson,
    loading: NotablePersonBodySkeleton,
  },
);
