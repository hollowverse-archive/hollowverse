import React from 'react';

import IntersectionObserver, {
  IntersectionObserverProps,
} from 'react-intersection-observer';
import { Image, Props as ImageProps } from 'components/Image/Image';

export type Props = ImageProps &
  Pick<IntersectionObserverProps, 'rootMargin'> & {
    outerClassName?: string;
  };

export class LazyImage extends React.PureComponent<Props> {
  render() {
    const { rootMargin, outerClassName, ...imageProps } = this.props;

    return (
      <IntersectionObserver
        rootMargin="25%"
        triggerOnce
        {...{ className: outerClassName }}
      >
        {inView => {
          if (!inView) {
            return this.props.loadingComponent;
          }

          return <Image {...imageProps} />;
        }}
      </IntersectionObserver>
    );
  }
}
