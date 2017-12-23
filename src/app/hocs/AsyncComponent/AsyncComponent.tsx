import * as React from 'react';

import { delay } from 'helpers/delay';
import {
  PendingResult,
  SuccessResult,
  ErrorResult,
} from 'helpers/asyncResults';

type AsyncProps<T> = {
  /**
   * Time in milliseconds after which loading is considered to have failed
   * Defaults to `10000`. If `null`, loading never times out.
   */
  timeout?: number | null;

  /**
   * Time in milliseconds to wait before the component is considered
   * to have started loading. The `load()` function will still be called
   * as soon as the component mounts. This is only intended to avoid flashing
   * of loading component in image components when using server side rendering
   * and the image is already cached client-side.
   * In such cases, the loading component would should for a brief moment before
   * it is replaced with the cached image.
   * Defaults to `200`.
   */
  delay?: number;

  load(): Promise<T>;

  children(props: {
    result: State<T | null>;
    retry(): void;
  }): JSX.Element | null;
};

type State<T> = (
  | ({
      hasTimedOut: false;
    } & (PendingResult | SuccessResult<T>))
  | (ErrorResult & { hasTimedOut: boolean })) & {
  isPastDelay: boolean;
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
  State<T | null>
> {
  static defaultProps: Partial<AsyncProps<any>> = {
    delay: 200,
    timeout: 10000,
  };

  state: State<T | null> = {
    isInProgress: false,
    hasError: false,
    hasTimedOut: false,
    value: null,
    isPastDelay: false,
  };

  tryLoading = async () => {
    const loadPromise = this.props.load();

    this.setState(
      { value: null, isInProgress: true, hasError: false, hasTimedOut: false },
      () => {
        const promises = [
          loadPromise.then(value => {
            this.setState({ value, isInProgress: false, isPastDelay: false });
          }),
        ];

        if (this.props.delay !== undefined) {
          promises.push(
            delay(this.props.delay).then(() => {
              this.setState({ isPastDelay: true });
              loadPromise.then(value => {
                this.setState({ value, isInProgress: false });
              });
            }),
          );
        }

        const { timeout = null } = this.props;
        if (timeout !== null) {
          promises.push(
            delay(timeout).then(() => {
              this.setState({ hasTimedOut: true, hasError: true });
            }),
          );
        }

        Promise.race(promises).catch(() => {
          this.setState({ isInProgress: false, hasError: true });
        });
      },
    );
  };

  componentDidMount() {
    // tslint:disable-next-line no-floating-promises
    this.tryLoading();
  }

  render() {
    return this.props.children({ result: this.state, retry: this.tryLoading });
  }
}
