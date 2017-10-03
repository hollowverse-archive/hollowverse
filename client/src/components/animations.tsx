import * as React from 'react';
import * as ReactCSSTransitionGroup from 'react-addons-css-transition-group';

/** CSS Animation */
export class FadeInDown extends React.PureComponent<{}, {}> {
  render() {
    return (
      <ReactCSSTransitionGroup
        transitionName="fadeInDown"
        transitionEnterTimeout={100}
        transitionLeaveTimeout={100}
      >
        {this.props.children}
      </ReactCSSTransitionGroup>
    );
  }
}

/** CSS Animation */
export class FadeInUp extends React.PureComponent<{}, {}> {
  render() {
    return (
      <ReactCSSTransitionGroup
        transitionName="fadeInUp"
        transitionEnterTimeout={100}
        transitionLeaveTimeout={100}
      >
        {this.props.children}
      </ReactCSSTransitionGroup>
    );
  }
}

interface FadeInProps {
  timeout?: 100 | 200 | 300 | 400;
}

/** CSS Animation */
export class FadeIn extends React.PureComponent<FadeInProps, {}> {
  static defaultProps: FadeInProps = {
    timeout: 100,
  };

  render() {
    return (
      <ReactCSSTransitionGroup
        transitionName={`fadeIn-${this.props.timeout}`}
        transitionEnterTimeout={this.props.timeout}
        transitionLeaveTimeout={this.props.timeout}
      >
        {this.props.children}
      </ReactCSSTransitionGroup>
    );
  }
}
