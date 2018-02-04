import * as React from 'react';
import cc from 'classcat';

import * as classes from './SvgIcon.module.scss';

type Props = React.HTMLAttributes<HTMLImageElement> & { url: string } & {
  /** Height of icon in pixels */
  size?: number | string;
};

export const SvgIcon = ({ url, className, size = 32, ...rest }: Props) => (
  <img
    {...rest}
    height={size}
    role="presentation"
    src={url}
    className={cc([className, classes.root])}
  />
);
