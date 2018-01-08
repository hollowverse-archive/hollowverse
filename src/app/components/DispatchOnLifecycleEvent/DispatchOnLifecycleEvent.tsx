import * as React from 'react';
import { Action, GenericAction } from 'store/types';
import { connect } from 'react-redux';

type OwnProps = {
  updateKey?: string;
  onDidMountOrUpdate?: Action | Action[];
  onWillMountOrUpdate?: Action | Action[];
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
      const { onDidMountOrUpdate } = this.props;
      if (onDidMountOrUpdate) {
        this.dispatch(onDidMountOrUpdate);
      }
    }

    componentDidUpdate(nextProps: Props) {
      if (nextProps.updateKey !== this.props.updateKey) {
        this.componentDidMount();
      }
    }

    componentWillMount() {
      const { onWillMountOrUpdate } = this.props;
      if (onWillMountOrUpdate) {
        this.dispatch(onWillMountOrUpdate);
      }
    }

    componentWillUpdate(nextProps: Props) {
      if (nextProps.updateKey !== this.props.updateKey) {
        this.componentWillMount();
      }
    }

    componentWillUnmount() {
      const { onWillUnmount } = this.props;
      if (onWillUnmount) {
        this.dispatch(onWillUnmount);
      }
    }

    render() {
      return this.props.children as any;
    }
  },
);
