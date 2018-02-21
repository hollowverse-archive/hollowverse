import React from 'react';
import cc from 'classcat';

import classes from './MessageWithIcon.module.scss';

type Props = {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  button?: React.ReactNode;
} & React.HTMLAttributes<HTMLDivElement>;

export const MessageWithIcon = ({
  title,
  icon,
  description,
  button,
  children,
  className,
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
    <div className={classes.title}>{title}</div>
    <div className={classes.description}>
      {description ? description : null}
      {children}
    </div>
    <div className={classes.buttonWrapper}>{button}</div>
  </div>
);
