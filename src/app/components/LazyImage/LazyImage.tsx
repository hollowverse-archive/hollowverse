import * as React from 'react';

import {
  OptionalIntersectionObserver,
  Props as IntersectionObserverProps,
} from 'components/OptionalIntersectionObserver/OptionalIntersectionObserver';
import { Image, Props as ImageProps } from 'components/Image/Image';

type Props = ImageProps & Pick<IntersectionObserverProps, 'rootMargin'>;

export class LazyImage extends React.PureComponent<Props> {
  render() {
    const { rootMargin, ...imageProps } = this.props;

    return (
      <OptionalIntersectionObserver rootMargin="0% 0% 25% 0%" triggerOnce>
        {inView => {
          if (!inView) {
            return this.props.loadingComponent;
          }

          return <Image {...imageProps} />;
        }}
      </OptionalIntersectionObserver>
    );
  }
}
