import * as React from 'react';

import { AsyncResult, pendingResult } from 'helpers/asyncResults';
import { ResolvedData, ResolvedDataKey, StoreState } from 'store/types';
import { connect } from 'react-redux';
import { getResolvedDataForKey } from 'store/features/data/selectors';
import { requestData } from 'store/features/data/actions';

type OwnProps<Key extends ResolvedDataKey = ResolvedDataKey> = {
  /**
   * The key used to store the results in Redux state
   */
  dataKey: Key;

  /**
   * A unique identifier for the resolve request, if this changes,
   * `load()` will be called again
   */
  requestId: string | null;

  /** Whether to keep the results of the previous request while loading the new results */
  allowOptimisticUpdates?: boolean;

  /**
   * If set to `true`, the request will be skipped on the server and
   * performed when the component mounts on the client.
   */
  clientOnly?: boolean;

  /**
   * An async function that returns the data.
   * The results will be passed to the `children` function after being
   * wrapped in an `AsyncResult`.
   */
  load(): Promise<ResolvedData[Key]>;

  /**
   * A function that receives the result of the `load` function when
   * it resolves. While resolving, children receive a pending result
   * or an optimistic result depending on whether `allowOptimisitcUpdates`
   * is enabled.
   */
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
      load,
      requestId,
      allowOptimisticUpdates = false,
    } = this.props;
    this.props.requestData({
      key: dataKey,
      requestId,
      load,
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

export const WithData = connect<
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
