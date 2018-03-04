import universal from 'react-universal-component';
import { NotablePersonBodySkeleton } from 'pages/NotablePerson/NotablePersonBodySkeleton';

export const LoadablePrivacyPolicy = universal(import('./PrivacyPolicy'), {
  key: module => module.PrivacyPolicy,
  loading: NotablePersonBodySkeleton,
});
