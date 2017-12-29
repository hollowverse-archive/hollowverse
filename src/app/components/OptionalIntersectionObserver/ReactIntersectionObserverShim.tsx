import * as React from 'react';
import { IntersectionObserverProps } from 'react-intersection-observer';

export class Shim extends React.PureComponent<IntersectionObserverProps> {
  render() {
    const { children } = this.props;

    const child = typeof children === 'function' ? children(true) : children;

    if (__IS_SERVER__) {
      return (
        <div>
          <noscript>{child}</noscript>
        </div>
      );
    }

    return <div>{child}</div>;
  }
}
