import React from 'react';
import classes from './LoadingSpinner.module.scss';

type Props = {
  size?: number;
} & React.HTMLAttributes<SVGElement>;

export const LoadingSpinner = ({ size = 50, ...rest }: Props) => (
  <svg
    {...rest}
    className={classes.loaderCircular}
    height={size}
    width={size}
    viewBox="25 25 50 50"
  >
    <circle
      className={classes.loaderPath}
      cx="50"
      cy="50"
      r="20"
      fill="none"
      strokeWidth="3"
      strokeMiterlimit="10"
    />
  </svg>
);
