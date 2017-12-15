import * as React from 'react';
import cc from 'classcat';

import { OptionalIntersectionObserver } from 'components/OptionalIntersectionObserver/OptionalIntersectionObserver';

import * as classes from './Sticky.module.scss';

type Props = {
  height: number;
  children(isInView: boolean): React.ReactNode;
} & React.HTMLAttributes<HTMLDivElement>;

type State = {
  isSticking: boolean;
};

export class Sticky extends React.PureComponent<Props, State> {
  state: State = {
    isSticking: false,
  };

  handleChange = (isInView: boolean) => {
    this.setState({ isSticking: !isInView });
  };

  render() {
    const { children, height, className, ...rest } = this.props;
    const { isSticking } = this.state;

    return (
      <div
        className={cc([
          classes.container,
          {
            [classes.isSticking]: isSticking,
          },
        ])}
      >
        <OptionalIntersectionObserver
          threshold={1}
          onChange={this.handleChange}
        >
          <div className={classes.placeholder} style={{ height }} />
        </OptionalIntersectionObserver>
        <div
          className={cc([classes.element, className])}
          {...rest}
          style={{ height }}
        >
          {children(isSticking)}
        </div>
      </div>
    );
  }
}
