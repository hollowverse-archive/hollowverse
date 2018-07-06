import React from 'react';
import cc from 'classcat';

import classes from './Toggle.module.scss';

type Props = React.InputHTMLAttributes<HTMLInputElement>;

export const Toggle = ({ className, children, ...rest }: Props) => (
  <div className={classes.root}>
    <label htmlFor="toggle" className={cc([className, classes.label])}>
      <input id="toggle" type="checkbox" {...rest} />
      <div className={classes.children}>{children}</div>
      <div className={classes.switch} />
    </label>
  </div>
);
