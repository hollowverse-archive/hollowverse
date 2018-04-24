import React from 'react';
import loadable from 'react-loadable';
import { NotablePersonBody } from './NotablePersonBody';
import { loadableDefaultOptions } from 'helpers/loadableDefaultOptions';

import classes from './LoadableNotablePerson.module.scss';

export const LoadableNotablePerson = loadable({
  ...loadableDefaultOptions,
  loader: async () =>
    import('./NotablePerson').then(module => module.NotablePerson),
  loading: () => (
    <div className={classes.root}>
      <NotablePersonBody />
    </div>
  ),
});
