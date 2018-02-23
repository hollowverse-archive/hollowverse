import React from 'react';

import { AsyncResult, pendingResult } from 'helpers/asyncResults';
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
  allowOptimisticUpdates?: boolean;

  /**
   * If set to `true`, the request will be skipped on the server and
   * performed when the component mounts on the client.
   * @default `false`
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
  resolve(props = this.props) {
    const {
      dataKey,
      forPage,
      load,
      requestId,
      allowOptimisticUpdates = false,
    } = props;
    props.requestData({
      key: dataKey,
      requestId,
      forPage,
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
      this.resolve(nextProps);
    }
  }

  render() {
    const { result, requestId, allowOptimisticUpdates } = this.props;
    let finalResult = result;

    if (result.requestId !== requestId && !allowOptimisticUpdates) {
      finalResult = {
        ...pendingResult,
        requestId,
      };
    }

    return this.props.children({ result: finalResult });
  }
}

/**
 * This component is used to fetch data needed by a component whether **on the server**
 * or **on the client**.
 *
 * It supports:
 * * An arbitrary asynchronous function to load the data (`props.load`)
 * * Server-side rendering with the resolved data from the function
 * * The ability to opt-out of server-side rendering per-component (`props.clientOnly`)
 * * Optimistic results by keeping the results of
 *   the previous call to the load function (`props.allowOptimisticUpdates`)
 * * Integration with Redux: the results are stored in Redux store and provided
 *   to the wrapped component.
 *
 * To be able to use this with server-side rendering, you need to use
 * a helper library to delay React rendering of the component tree
 * until the asynchronous data request is finished.
 *
 * This can be done using libraries like `react-redux-epic` and `redux-observable`.
 *
 * While the data is being fetched, the children are allowed to render and are passed
 * a `AsyncResult` object that describes the progress of the request, and depending on
 * whether `allowOptimisticUpdates` is enabled, the `AsyncResult` may also contain
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
