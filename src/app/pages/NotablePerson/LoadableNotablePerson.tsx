import React from 'react';
import loadable from 'react-loadable';
import { NotablePersonBody } from './NotablePersonBody';
import { loadableDefaultOptions } from 'helpers/loadableDefaultOptions';

export const LoadableNotablePerson = loadable({
  ...loadableDefaultOptions,
  loader: async () =>
    import('./NotablePerson').then(module => module.NotablePerson),
  loading: () => <NotablePersonBody />,
});
