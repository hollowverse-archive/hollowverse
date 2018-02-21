import React from 'react';
import { Action, GenericAction } from 'store/types';
import { connect } from 'react-redux';

type OwnProps = {
  onDidMount?: Action | Action[];
  onWillMount?: Action | Action[];
  onWillUnmount?: Action | Action[];
};

type DispatchProps = {
  dispatch(action: GenericAction): any;
};

type Props = OwnProps & DispatchProps;

export const DispatchOnLifecycleEvent = connect<{}, DispatchProps, OwnProps>(
  undefined,
)(
  class extends React.PureComponent<Props> {
    dispatch(actionOrActions: Action | Action[]) {
      if (Array.isArray(actionOrActions)) {
        actionOrActions.forEach(action => {
          this.props.dispatch(action);
        });
      } else {
        this.props.dispatch(actionOrActions);
      }
    }

    componentDidMount() {
      const { onDidMount } = this.props;
      if (onDidMount) {
        this.dispatch(onDidMount);
      }
    }

    componentWillMount() {
      const { onWillMount } = this.props;
      if (onWillMount) {
        this.dispatch(onWillMount);
      }
    }

    componentWillUnmount() {
      const { onWillUnmount } = this.props;
      if (onWillUnmount) {
        this.dispatch(onWillUnmount);
      }
    }

    render() {
      return this.props.children || null;
    }
  },
);
