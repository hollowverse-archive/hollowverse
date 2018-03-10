import React from 'react';
import cc from 'classcat';

import {
  OptionalIntersectionObserver,
  Props as OptionalIntersectionObserverProps,
} from 'components/OptionalIntersectionObserver/OptionalIntersectionObserver';

import classes from './Sticky.module.scss';

type Props = {
  height: number;
  innerClassName?: string;
  children(isInView: boolean): React.ReactNode | React.ReactNode[];
} & React.HTMLAttributes<HTMLDivElement> &
  Pick<OptionalIntersectionObserverProps, 'rootMargin'>;

type State = {
  isSticking: boolean;
};

/**
 * How this component works:
 * 1. Makes the target element fixed.
 * 2. Creates a placeholder element to maintain the space of the target element.
 * 3. Now the two elements are laid out in the same space.
 * 4. The target element is on top because `fixed` creates a new stacking context.
 * 5. Now when the user scrolls, the placeholder will go out of view,
 * while the target will stay fixed at the top of the viewport.
 * 6. We monitor the placeholder element so that when it goes out of view, it means
 * that the target element is now effectively sticking from the user's point
 * of view.
 * 7. We communicate the state changes in the render prop (`children`) in case we want
 * to do something with that information, which we do in the case of `NavBar`:
 * we want to transform the `NavBar` to `SearchBar`.
 */
export class Sticky extends React.PureComponent<Props, State> {
  state: State = {
    isSticking: false,
  };

  handleChange = (isInView: boolean) => {
    this.setState({ isSticking: !isInView });
  };

  render() {
    const {
      children,
      height,
      className,
      rootMargin,
      innerClassName,
      ...rest
    } = this.props;
    const { isSticking } = this.state;

    return (
      <div className={cc([classes.container, className])}>
        <OptionalIntersectionObserver
          threshold={1}
          rootMargin={rootMargin}
          onChange={this.handleChange}
        >
          <div className={classes.placeholder} style={{ height }} />
        </OptionalIntersectionObserver>
        <div
          className={cc([classes.element, innerClassName])}
          {...rest}
          style={{ height }}
        >
          {children(isSticking)}
        </div>
      </div>
    );
  }
}
