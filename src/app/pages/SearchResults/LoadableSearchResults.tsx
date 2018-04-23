import loadable from 'react-loadable';
import { loadableDefaultOptions } from 'helpers/loadableDefaultOptions';

export const LoadableSearchResults = loadable({
  ...loadableDefaultOptions,
  loader: async () =>
    import('./SearchResults').then(module => module.SearchResults),
});
