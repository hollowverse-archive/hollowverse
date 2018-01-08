import * as React from 'react';
import { Action, GenericAction } from 'store/types';
import { connect } from 'react-redux';

type OwnProps = {
  key: string;
  onDidMount?: Action;
  onWillMount?: Action;
  onWillUnmount?: Action;
};

type DispatchProps = {
  dispatch(action: GenericAction): any;
};

type Props = OwnProps & DispatchProps;

export const DispatchOnLifecycleEvent = connect<{}, DispatchProps, OwnProps>(
  undefined,
)(
  class extends React.PureComponent<Props> {
    componentDidMount() {
      const { onDidMount } = this.props;
      if (onDidMount) {
        this.props.dispatch(onDidMount);
      }
    }

    componentWillMount() {
      const { onWillMount } = this.props;
      if (onWillMount) {
        this.props.dispatch(onWillMount);
      }
    }

    componentWillUnmount() {
      const { onWillUnmount } = this.props;
      if (onWillUnmount) {
        this.props.dispatch(onWillUnmount);
      }
    }

    render() {
      return this.props.children as any;
    }
  },
);
