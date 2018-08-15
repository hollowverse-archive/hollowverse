import React from 'react';
import cc from 'classcat';
import {
  createStyles,
  withStyles,
  WithStyles,
  Theme,
} from '@material-ui/core/styles';

const styles = (theme: Theme) =>
  createStyles({
    root: {
      position: 'relative',
      padding: '0 calc(1em + 10px)',
      marginTop: 10,
      '&$large p': {
        fontSize: '1.25em',
        fontWeight: 300,
        lineHeight: 1.5,
      },
      '& > :first-child::before, & > :last-child::after': {
        position: 'absolute',
        fontFamily: 'Georgia, "Times New Roman", Times, serif',
        fontSize: '175%',
        color: theme.palette.text.secondary,
        opacity: 0.4,
        marginLeft: 10,
      },
      '& > :first-child::before': {
        display: 'block',
        content: '"“"',
        float: 'left',
        left: 0,
        top: -10,
      },
      '& > :last-child::after': {
        content: '"”"',
        lineHeight: 1,
      },
    },
    large: {},
  });

type Props = React.BlockquoteHTMLAttributes<HTMLElement> & {
  size?: 'normal' | 'large';
} & WithStyles<ReturnType<typeof styles>>;

export const Quote = withStyles(styles)(
  ({ className, classes, size = 'normal', ...rest }: Props) => (
    <blockquote
      className={cc([
        className,
        classes.root,
        { [classes.large]: size === 'large' },
      ])}
      {...rest}
    />
  ),
);
