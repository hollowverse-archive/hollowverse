import * as React from 'react';
import { IntersectionObserverProps } from 'react-intersection-observer';

type Props = IntersectionObserverProps & {
  fallbackIsInView: boolean;
};

export const Shim = ({
  children = null,
  fallbackIsInView = true,
  ...rest
}: Props) => {
  return (
    <div {...rest}>
      {typeof children === 'function' ? children(fallbackIsInView) : children}
    </div>
  );
};
