import * as React from 'react';
import { Action, GenericAction } from 'store/types';
import { connect } from 'react-redux';

type Props = {
  children: JSX.Element | null;
  afterChildrenRendered?: Action;
  beforeRender?: Action;
  dispatch(action: GenericAction): any;
};

class UnconnectedDispatchOnLifecycleEvent extends React.PureComponent<Props> {
  componentDidMount() {
    const { afterChildrenRendered } = this.props;
    if (afterChildrenRendered) {
      this.props.dispatch(afterChildrenRendered);
    }
  }

  componentWillMount() {
    const { beforeRender } = this.props;
    if (beforeRender) {
      this.props.dispatch(beforeRender);
    }
  }

  render() {
    return this.props.children;
  }
}

export const DispatchOnLifecycleEvent = connect(undefined)(
  UnconnectedDispatchOnLifecycleEvent,
);
