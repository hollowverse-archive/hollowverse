import { IntersectionObserverProps } from 'react-intersection-observer';

type Props = IntersectionObserverProps & {
  fallbackIsInView: boolean;
};

export const Shim = ({ children = null, fallbackIsInView = true }: Props) => {
  return typeof children === 'function' ? children(fallbackIsInView) : children;
};
