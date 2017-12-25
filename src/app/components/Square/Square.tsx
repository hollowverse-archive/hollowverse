import * as React from 'react';
import cc from 'classcat';
import * as classes from './Square.module.scss';

export const Square = ({
  className,
  children,
  ...rest
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cc([classes.root, className])} {...rest}>
    <div className={classes.content}>{children}</div>
  </div>
);
