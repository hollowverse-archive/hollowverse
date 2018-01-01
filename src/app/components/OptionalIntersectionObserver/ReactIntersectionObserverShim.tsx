import * as React from 'react';
import { IntersectionObserverProps } from 'react-intersection-observer';

type Props = IntersectionObserverProps & {
  fallbackIsInView: boolean;
};

export const Shim = ({
  children = null,
  fallbackIsInView = true,
  tag = 'div',
  ...rest
}: Props) => {
  return React.createElement(tag, {
    children:
      typeof children === 'function' ? children(fallbackIsInView) : children,
    ...rest,
  });
};
