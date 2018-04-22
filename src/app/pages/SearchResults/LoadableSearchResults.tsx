import React from 'react';
import loadable from 'react-loadable';

export const LoadableSearchResults = loadable({
  loader: () =>
    import('./SearchResults').then(({ SearchResults }) => SearchResults),
  loading: () => <div />,
});
