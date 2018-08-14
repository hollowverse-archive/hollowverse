import React from 'react';
import cc from 'classcat';

import { withStyles, WithStyles, createStyles } from '@material-ui/core/styles';

// See https://spin.atomicobject.com/2015/07/14/css-responsive-square/
const styles = createStyles({
  root: {
    width: '100%',
    position: 'relative',
    '&::after': {
      content: '""',
      display: 'block',
      paddingBottom: '100%',
    },
  },
  content: {
    position: 'absolute',
    overflowY: 'hidden',
    width: '100%',
    height: '100%',
  },
});

type Props = React.HTMLAttributes<HTMLDivElement> & WithStyles<typeof styles>;

/**
 * A responsive container that maintains its 1:1 aspect ratio
 * regardless of its implicit/explicit width, works with flex containers.
 */
export const Square = withStyles(styles)(
  ({ className, classes, children, ...rest }: Props) => (
    <div className={cc([classes.root, className])} {...rest}>
      <div className={classes.content}>{children}</div>
    </div>
  ),
);
