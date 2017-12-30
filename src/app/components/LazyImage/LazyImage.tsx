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
      <OptionalIntersectionObserver rootMargin="25%" triggerOnce>
        {inView => {
          if (__IS_SERVER__) {
            return (
              <noscript>
                <Image {...imageProps} />
              </noscript>
            );
          }

          if (!inView) {
            return this.props.loadingComponent;
          }

          return (
            <div>
              <Image {...imageProps} />
            </div>
          );
        }}
      </OptionalIntersectionObserver>
    );
  }
}
