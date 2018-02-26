import React from 'react';
import { IntersectionObserverProps } from 'react-intersection-observer';

type Props = IntersectionObserverProps & {
  fallbackIsInView?: boolean;
};

export const Shim = ({
  children,
  fallbackIsInView = true,
  tag = 'div',
  rootMargin: _,
  threshold: __,
  root: ___,
  rootId: _____,
  triggerOnce: ______,
  ...rest
}: Props) => {
  return React.createElement(
    tag,
    rest,
    typeof children === 'function' ? children(fallbackIsInView) : children,
  );
};
