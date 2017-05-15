import * as React from 'react'
import * as ReactCSSTransitionGroup from 'react-addons-css-transition-group'

export class FadeInDown extends React.Component<{}, undefined> {
  render() {
    return (
      <ReactCSSTransitionGroup
        transitionName='fadeInDown'
        transitionEnterTimeout={100}
        transitionLeaveTimeout={100}
      >
        {this.props.children}
      </ReactCSSTransitionGroup>
    )
  }
}

export class FadeInUp extends React.Component<{}, undefined> {
  render() {
    return (
      <ReactCSSTransitionGroup
        transitionName='fadeInUp'
        transitionEnterTimeout={100}
        transitionLeaveTimeout={100}
      >
        {this.props.children}
      </ReactCSSTransitionGroup>
    )
  }
}

interface IFadeInProps {timeout?: 100 | 200 | 300 | 400}
export class FadeIn extends React.Component<IFadeInProps, undefined> {
  static defaultProps: IFadeInProps = {
    timeout: 100,
  }

  render() {
    return (
      <ReactCSSTransitionGroup
        transitionName={`fadeIn-${this.props.timeout}`}
        transitionEnterTimeout={this.props.timeout}
        transitionLeaveTimeout={this.props.timeout}
      >
        {this.props.children}
      </ReactCSSTransitionGroup>
    )
  }
}
