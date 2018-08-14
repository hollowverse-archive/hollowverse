import React from 'react';
import cc from 'classcat';

import {
  createStyles,
  withStyles,
  WithStyles,
  Theme,
} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

const styles = (theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      flexGrow: 1,
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      minHeight: 175,
    },
    hasDescription: {},
    title: {
      color: theme.palette.text.secondary,
    },
    '$hasDescription $title': {
      fontWeight: 'bold',
      color: theme.palette.text.primary,
    },
    icon: {
      padding: theme.spacing.unit,
    },
    buttonWrapper: {
      display: 'block',
      marginTop: theme.spacing.unit,
    },
  });

type Props = {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  button?: React.ReactNode;
} & React.HTMLAttributes<HTMLDivElement> &
  WithStyles<ReturnType<typeof styles>>;

export const MessageWithIcon = withStyles(styles)(
  ({
    title,
    icon,
    description,
    button,
    children,
    className,
    classes,
    ...rest
  }: Props) => (
    <div
      className={cc([
        className,
        {
          [classes.root]: true,
          [classes.hasDescription]: typeof description === 'string',
        },
      ])}
      {...rest}
    >
      <div className={classes.icon}>{icon}</div>
      <Typography variant="title" component="div">
        {title}
      </Typography>
      <Typography component="div" color="textSecondary">
        {description}
        {children}
      </Typography>
      <div className={classes.buttonWrapper}>{button}</div>
    </div>
  ),
);
