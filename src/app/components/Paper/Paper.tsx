import React from 'react';
import cc from 'classcat';

import classes from './Paper.module.scss';

type Props = React.HTMLAttributes<HTMLDivElement>;

export const Paper = ({ className, ...rest }: Props) => (
  <div className={cc([className, classes.root])} {...rest} />
);
