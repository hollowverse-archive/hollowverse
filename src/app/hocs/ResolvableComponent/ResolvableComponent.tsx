import * as React from 'react';

import { AsyncResult, pendingResult } from 'helpers/asyncResults';
import { ResolvedData, ResolvedDataKey, StoreState } from 'store/types';
import { connect } from 'react-redux';
import { getResolvedDataForKey } from 'store/features/data/selectors';
import { requestData } from 'store/features/data/actions';

type OwnProps<Key extends ResolvedDataKey = ResolvedDataKey> = {
  dataKey: Key;
  /**
   * A unique identifier for the resolve request, if this changes,
   * `resolve()` will be called again
   */
  requestId: string | null;
  allowOptimisticUpdates?: boolean;

  clientOnly?: boolean;
  resolve(): Promise<ResolvedData[Key]>;
  children({
    result,
  }: {
    result: AsyncResult<ResolvedData[Key] | null>;
  }): JSX.Element | null;
};

type StateProps<Key extends ResolvedDataKey = ResolvedDataKey> = {
  result: AsyncResult<ResolvedData[Key] | null> & {
    requestId: string | null;
  };
};

type DispatchProps = {
  requestData: typeof requestData;
};

type Props<K extends ResolvedDataKey = ResolvedDataKey> = OwnProps<K> &
  StateProps<K> &
  DispatchProps;

class Wrapper extends React.Component<Props> {
  resolve() {
    const {
      dataKey,
      resolve,
      requestId,
      allowOptimisticUpdates = false,
    } = this.props;
    this.props.requestData({
      key: dataKey,
      requestId,
      resolve,
      allowOptimisticUpdates,
    });
  }

  componentWillMount() {
    if (this.props.clientOnly && __IS_SERVER__) {
      return;
    }

    if (this.props.result.requestId !== this.props.requestId) {
      this.resolve();
    }
  }

  componentWillReceiveProps(nextProps: Props) {
    if (nextProps.requestId !== this.props.requestId) {
      this.resolve();
    }
  }

  render() {
    const { result = pendingResult } = this.props;

    return this.props.children({ result });
  }
}

export const ResolvableComponent = connect<
  StateProps,
  DispatchProps,
  OwnProps,
  StoreState
>(
  (state, ownProps) => ({
    result: getResolvedDataForKey(state)(ownProps.dataKey),
  }),
  { requestData },
)(Wrapper);
