import * as React from 'react';
import * as classes from './LoadingSpinner.module.scss';

type Props = {
  size?: number;
};

export const LoadingSpinner = ({ size = 50 }: Props) => (
  <svg
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
