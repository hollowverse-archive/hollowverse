import * as React from 'react';
import * as classes from './Card.module.scss';

type Props = {
  children: JSX.Element[] | JSX.Element;
} & React.HTMLAttributes<HTMLDivElement>;

export const Card = ({ children, ...rest }: Props) => (
  <div className={classes.root} {...rest}>
    <div className={classes.content}>{children}</div>
  </div>
);
