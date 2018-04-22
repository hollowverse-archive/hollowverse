import { LoadingSpinner } from 'components/LoadingSpinner/LoadingSpinner';
import { CommonOptions } from 'react-loadable';

export const loadableDefaultOptions: CommonOptions = {
  loading: LoadingSpinner,
  delay: 200,
};
