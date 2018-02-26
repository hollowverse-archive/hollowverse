import React from 'react';
import cc from 'classcat';
import classes from './Card.module.scss';

type Props = React.HTMLAttributes<HTMLDivElement>;

export const Card = ({ children, className, ...rest }: Props) => (
  <div className={cc([classes.root, className])} {...rest}>
    {children}
  </div>
);
