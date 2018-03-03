import React from 'react';
import cc from 'classcat';

import classes from './TextPage.module.scss';

export const TextPage = ({
  className,
  ...rest
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={classes.root}>
    <div className={cc([className, classes.container])} {...rest} />
  </div>
);
