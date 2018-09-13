// tslint:disable function-name
/* eslint-disable camelcase */
import React from 'react';

import {
  AsyncResult,
  isStaleResult,
  isOptimisticResult,
  pendingResult,
} from 'helpers/asyncResults';
import { ResolvedData, ResolvedDataKey, StoreState } from 'store/types';
import { connect } from 'react-redux';
import { getResolvedDataForKey } from 'store/features/asyncData/selectors';
import { requestData } from 'store/features/asyncData/actions';

type OwnProps<Key extends ResolvedDataKey = ResolvedDataKey> = {
  /**
   * The key used to store the results in Redux state
   */
  dataKey: Key;

  /**
   * (Optional)
   * The page path for which this data request is triggered, useful for logging
   */
  forPage?: string;

  /**
   * A unique identifier for the resolve request, if this changes,
   * `load()` will be called again
   */
  requestId: string | null;

  /**
   * Whether to keep the results of the previous request while loading
   * the new results
   * @default `false`
   */
  keepStaleData?: boolean;

  /**
   * An incomplete optimistic version of the data that is expected
   * to be loaded.
   */
  allowOptimisticUpdates?: boolean;

  /**
   * An async function that returns the data.
   * The results will be passed to the `children` function after being
   * wrapped in an `AsyncResult`.
   */
  load(): Promise<ResolvedData[Key]>;

  /**
   * A function that receives the result of the `load` function when
   * it resolves. While resolving, children receive a pending result,
   * an optimistic result or a stale result depending on whether
   * `allowOptimisticUpdates` or `keepStaleData` is enabled.
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

class Wrapper extends React.PureComponent<Props> {
  resolve(props = this.props) {
    const { dataKey, forPage, load, requestId, keepStaleData = false } = props;
    props.requestData({
      key: dataKey,
      requestId,
      forPage,
      load,
      keepStaleData,
    });
  }

  // tslint:disable-next-line function-name
  UNSAFE_componentWillMount() {
    if (this.props.result.requestId !== this.props.requestId) {
      this.resolve();
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps: Props) {
    if (nextProps.requestId !== this.props.requestId) {
      this.resolve(nextProps);
    }
  }

  render() {
    const { result, keepStaleData, allowOptimisticUpdates } = this.props;
    let finalResult = result;

    if (
      (isStaleResult(result) && keepStaleData === false) ||
      (isOptimisticResult(result) && allowOptimisticUpdates === false)
    ) {
      finalResult = {
        ...result,
        ...pendingResult,
      };
    }

    return this.props.children({ result: finalResult });
  }
}

/**
 * This component is used to fetch data needed by a component.
 *
 * It supports:
 * * An arbitrary asynchronous function to load the data (`props.load`)
 * * Stale results by keeping the results of
 *   the previous call to the load function (`props.keepStaleData`)
 * * Partial optimistic responses (`props.allowOptimisticUpdates`)
 * * Integration with Redux: the results are stored in Redux store and provided
 *   to the wrapped component.
 *
 * While the data is being fetched, the children are allowed to render and are passed
 * a `AsyncResult` object that describes the progress of the request, and depending on
 * whether `allowOptimisticUpdates` or `keepStaleData` are enabled,
 * the `AsyncResult` may also contain a partial optimistic response or
 * the results of the previous call to `load`.
 */
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
