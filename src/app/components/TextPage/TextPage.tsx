import React from 'react';
import cc from 'classcat';

import {
  createStyles,
  withStyles,
  WithStyles,
  Theme,
} from '@material-ui/core/styles';

const styles = ({ breakpoints, palette, spacing }: Theme) =>
  createStyles({
    '@keyframes text-page': {
      from: {
        opacity: 0,
        transform: 'translateY(5px)',
      },
      to: {
        opacity: 1,
        transform: 'translateY(0)',
      },
    },
    root: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      '& h1': {
        fontSize: 26,
        fontWeight: 400,
        lineHeight: 1,
        margin: '0 0 26px',
      },
      '& h2': {
        fontSize: 20,
        margin: '0 0 10px',
      },
      '& h3, & h4': {
        fontWeight: 'bold',
        margin: '0 0 15px',
      },
      '& p': {
        margin: '0 0 15px',
      },
      '& ul, & ol': {
        margin: '0 30px 30px',
      },
      '& li': {
        margin: '0 0 15px',
      },
      '& a': {
        '&:hover': {
          textDecoration: 'underline',
        },
      },
      '& sup': {
        fontSize: 11,
        position: 'relative',
        verticalAlign: 'text-top',
        top: -3,
        '& a:hover': {
          textDecoration: 'none',
        },
      },
      '& blockquote': {
        fontSize: 20,
        fontWeight: 300,
        margin: '30px 0',
        lineHeight: 1.5,
        padding: '0 25px',
        '& sup': {
          fontWeight: 'normal',
        },
        '&::before, &::after': {
          position: 'absolute',
          fontSize: 40,
          fontFamily: 'Georgia, "Times New Roman", Times, serif',
          color: palette.text.secondary,
        },
        '&::before': {
          content: '"“"',
          left: 0,
          top: -10,
        },
        '&::after': {
          content: '"”"',
        },
      },
    },
    container: {
      flexGrow: 1,
      width: '100%',
      maxWidth: breakpoints.values.sm,
      padding: `${spacing.unit * 6}px ${spacing.unit * 3}px`,
      animation: 'text-page 0.3s',
      lineHeight: 1.6,
    },
  });

export const TextPage = withStyles(styles)(
  ({
    className,
    classes,
    ...rest
  }: React.HTMLAttributes<HTMLDivElement> &
    WithStyles<ReturnType<typeof styles>>) => (
    <div className={classes.root}>
      <div className={cc([className, classes.container])} {...rest} />
    </div>
  ),
);
