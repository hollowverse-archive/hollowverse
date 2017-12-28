import universal from 'react-universal-component';

export const LoadableSearchResults = universal(import('./SearchResults'), {
  key: 'SearchResults',
  loading: () => <div />,
});
