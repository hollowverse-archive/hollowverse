import * as React from 'react';
import { IntersectionObserverProps } from 'react-intersection-observer';

export const Shim = ({ children }: IntersectionObserverProps) => {
  return (
    <div>{typeof children === 'function' ? children(true) : children}</div>
  );
};
