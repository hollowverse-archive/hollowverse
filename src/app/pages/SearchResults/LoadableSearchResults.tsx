import React from 'react';
import loadable from 'react-loadable';

export const LoadableSearchResults = loadable({
  loader: () => import('./SearchResults').then(module => module.SearchResults),
  loading: () => <div />,
});
