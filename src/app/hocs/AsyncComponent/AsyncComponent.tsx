import * as React from 'react';

import { delay } from 'helpers/delay';

type AsyncProps<T> = {
  /**
   * Time in milliseconds after which loading is considered to have failed
   * Defaults to `6000`. If `null`, loading never times out.
   */
  timeout?: number | null;

  load(): Promise<T>;

  children(state: State<T> & { retry(): void }): JSX.Element | null;
};

type State<T> = {
  isLoading: boolean;
  hasError: boolean;
  timedOut: boolean;
  result: T | null;
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
 * 
 * Note: although this component is using a type parameter,
 * TypeScript is still unable to infer types from component usage.
 * For now, the type of `result` passed to `children` is inferred as `{}` which
 * is compatible with anything
 * See https://github.com/Microsoft/TypeScript/issues/18807
 */
export class AsyncComponent<T = any> extends React.PureComponent<
  AsyncProps<T>,
  State<T>
> {
  state: State<T> = {
    isLoading: false,
    hasError: false,
    timedOut: false,
    result: null,
  };

  tryLoading = () => {
    this.setState(
      { result: null, isLoading: true, hasError: false, timedOut: false },
      () => {
        const promises = [
          this.props.load().then(result => {
            this.setState({ result, isLoading: false });
          }),
        ];

        const { timeout = null } = this.props;
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
      },
    );
  };

  componentDidMount() {
    this.tryLoading();
  }

  render() {
    return this.props.children({ ...this.state, retry: this.tryLoading });
  }
}
