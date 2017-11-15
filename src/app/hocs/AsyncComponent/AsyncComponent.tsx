/**
 * FbComments Component
 */
import * as React from 'react';

import { delay } from 'helpers/delay';

type AsyncProps = {
  /**
   * Time in milliseconds after which loading is considered to have failed
   * Defaults to `6000`. If `null`, loading never times out.
   */
  timeout?: number | null;

  load(): Promise<any>;

  children(state: State & { retry(): void }): JSX.Element | null;
};

type State = {
  isLoading: boolean;
  hasError: boolean;
  timedOut: boolean;
};

/**
 * This component is used to execute an arbitrary asynchronous function (`props.load`)
 * **on the client** before rendering a component.
 * Unlike packages like `react-universal-component` and `react-loadable`, it is not
 * intended for executing the `load` function _synchronously_ on the server.
 * Instead, when called on the server, it acts like any regular React component and
 * will just return whatever its `children` function returns for `isLoading = false`,
 * i.e. the `load` function will never be called on the server.
 * 
 * Example use cases include: showing a loading indicator while importing the
 * Facebook comments plugin on the client and then waiting for comments to be rendered.
 */
export class AsyncComponent extends React.PureComponent<AsyncProps, State> {
  static defaultProps: Partial<AsyncProps> = {
    timeout: null,
  };

  state: State = {
    isLoading: false,
    hasError: false,
    timedOut: false,
  };

  tryLoading = () => {
    this.setState({ isLoading: true, hasError: false, timedOut: false }, () => {
      const promises = [
        this.props.load().then(() => {
          this.setState({ isLoading: false });
        }),
      ];

      const { timeout } = this.props;
      if (timeout !== null) {
        promises.push(
          delay(timeout).then(() => {
            this.setState(state => {
              if (state.isLoading) {
                return {
                  isLoading: false,
                  hasError: true,
                  timedOut: true,
                };
              }

              return undefined;
            });
          }),
        );
      }

      Promise.race(promises).catch(() => {
        this.setState({ isLoading: false, hasError: true });
      });
    });
  };

  componentDidMount() {
    this.tryLoading();
  }

  render() {
    return this.props.children({ ...this.state, retry: this.tryLoading });
  }
}
