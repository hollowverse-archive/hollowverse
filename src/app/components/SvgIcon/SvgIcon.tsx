import React from 'react';
import cc from 'classcat';

import classes from './SvgIcon.module.scss';

type Props = React.HTMLAttributes<SVGElement> &
  SpriteSymbol & {
    /** Height of icon in pixels */
    size?: number | string;
  };

export const SvgIcon = ({
  id: _, // Remove `id` from `rest` so it does not get assigned to this SVG element
  toString: __,
  url,
  viewBox,
  className,
  size = 32,
  ...rest
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
