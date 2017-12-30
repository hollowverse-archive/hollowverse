import { IntersectionObserverProps } from 'react-intersection-observer';

export const Shim = ({ children = null }: IntersectionObserverProps) => {
  return typeof children === 'function' ? children(__IS_SERVER__) : children;
};
