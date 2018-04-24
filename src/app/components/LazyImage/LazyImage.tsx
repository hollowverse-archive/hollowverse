import React from 'react';

import {
  OptionalIntersectionObserver,
  Props as IntersectionObserverProps,
} from 'components/OptionalIntersectionObserver/OptionalIntersectionObserver';
import { Image, Props as ImageProps } from 'components/Image/Image';

type Props = ImageProps &
  Pick<IntersectionObserverProps, 'rootMargin'> & {
    outerClassName?: string;
  };

export class LazyImage extends React.PureComponent<Props> {
  render() {
    const { rootMargin, outerClassName, ...imageProps } = this.props;

    return (
      <OptionalIntersectionObserver
        rootMargin="25%"
        triggerOnce
        className={outerClassName}
      >
        {(inView: boolean) => {
          if (!inView) {
            return this.props.loadingComponent;
          }

          return <Image {...imageProps} />;
        }}
      </OptionalIntersectionObserver>
    );
  }
}
