import * as React from 'react';

import { OptionalIntersectionObserver } from 'components/OptionalIntersectionObserver/OptionalIntersectionObserver';
import { Image, Props } from 'components/Image/Image';

export class LazyImage extends React.PureComponent<Props> {
  render() {
    return (
      <OptionalIntersectionObserver threshold={0} triggerOnce>
        {inView => {
          if (!inView) {
            return this.props.loadingComponent;
          }

          return <Image {...this.props} />;
        }}
      </OptionalIntersectionObserver>
    );
  }
}
