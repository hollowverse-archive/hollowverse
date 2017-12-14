import * as React from 'react';
import cc from 'classcat';

import * as classes from './Quote.module.scss';

type Props = React.BlockquoteHTMLAttributes<HTMLElement>;

export const Quote = ({ className, ...rest }: Props) => (
  <blockquote className={cc([className, classes.root])} {...rest} />
);
