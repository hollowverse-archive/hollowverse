import React from 'react';
import loadable from 'react-loadable';
import { NotablePersonBody } from './NotablePersonBody';

export const LoadableNotablePerson = loadable({
  loader: async () =>
    import('./NotablePerson').then(module => module.NotablePerson),
  loading: () => <NotablePersonBody />,
});
