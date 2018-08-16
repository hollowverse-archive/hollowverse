import React from 'react';
import loadable from 'react-loadable';
import { loadableDefaultOptions } from 'helpers/loadableDefaultOptions';
import { NotablePersonBody } from './NotablePersonBody';

import {
  withStyles,
  createStyles,
  WithStyles,
  Theme,
} from '@material-ui/core/styles';

export const styles = ({ breakpoints }: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      paddingBottom: 20,
      '& > *': {
        width: '100%',
        maxWidth: breakpoints.values.sm,
      },
    },
  });

type Props = WithStyles<ReturnType<typeof styles>>;

const LoadingComponent = withStyles(styles)<Props>(({ classes }) => (
  <div className={classes.root}>
    <NotablePersonBody />
  </div>
));

export const LoadableNotablePerson = loadable({
  ...loadableDefaultOptions,
  loader: async () =>
    import('./NotablePerson').then(module => module.NotablePerson),
  loading: LoadingComponent as any,
});
