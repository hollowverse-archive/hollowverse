import * as React from 'react';
import cc from 'classcat';

import * as classes from './SvgIcon.module.scss';

type Props = React.HTMLAttributes<SVGElement> &
  SpriteSymbol & {
    /** Height of icon in pixels */
    size?: number | string;
  };

export const SvgIcon = ({
  url,
  viewBox,
  className,
  size = 32,
  ...rest,
}: Props) => (
  <svg
    {...rest}
    height={size}
    role="presentation"
    viewBox={viewBox}
    className={cc([className, classes.root])}
  >
    <use xlinkHref={url} />
  </svg>
);
