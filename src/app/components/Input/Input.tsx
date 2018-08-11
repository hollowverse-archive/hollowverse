import React from 'react';
import DefaultInput, { InputProps } from '@material-ui/core/Input';
import { withStyles, createStyles, WithStyles } from '@material-ui/core/styles';

const styles = createStyles({
  root: {
    padding: '0 10px',
    background: 'rgb(241, 241, 243)',
    borderRadius: 3,
  },
  input: {
    textAlign: 'center',
    '&:focus': {
      textAlign: 'initial',
    },
  },
});

type Props = InputProps & WithStyles<typeof styles>;

export const Input = withStyles(styles)<Props>(({ classes, ...rest }) => (
  <DefaultInput disableUnderline classes={classes} {...rest} />
));
