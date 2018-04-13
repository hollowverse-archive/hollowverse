import React from 'react';

import { delay } from 'helpers/delay';
import {
  PendingResult,
  SuccessResult,
  ErrorResult,
} from 'helpers/asyncResults';
import {
  promiseToCancelable,
  Cancelable,
  isCancelRejection,
} from 'helpers/promiseToCancelable';

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
   * In such cases, the loading component would flash for a brief moment before
   * it is replaced with the cached image.
   *
   * If the delay is set to, say, 200ms, the browser has 200ms to show the image
   * before we trigger the "loading" state. If the image is already in the browser cache,
   * the browser will usually finish loading the image before the 200ms deadline,
   * and the loading state will never trigger, thus we avoid flashing.
   * Defaults to `null`.
   */
  delay?: number | null;

  /** Only called client-side */
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
 * **on the client** when a component mounts.
 * Unlike packages like `react-universal-component` and `react-loadable`, it is not
 * intended for loading React components on demand. Instead, the `load` function
 * could fetch arbitrary types of data or simply return nothing.
 *
 * This component does not support server-side rendering.
 * When called on the server, it acts like any regular React component and
 * will just return whatever its `children` function returns for `isInProgress = false`,
 * i.e. the `load` function will never be called on the server.
 *
 * Example use cases include: showing a loading indicator while importing the
 * Facebook comments plugin on the client and then waiting for comments to be rendered.
 *
 * If you have components that should have data fetched on the server, use the
 * `WithData` component.
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
    delay: null,
    timeout: 10000,
  };

  state: State<T | null> = {
    isInProgress: false,
    hasError: false,
    hasTimedOut: false,
    value: null,
    isPastDelay: false,
  };

  cancelableLoad: Cancelable<T> | undefined;

  tryLoading = () => {
    this.cancelableLoad = promiseToCancelable(this.props.load());

    const loadPromise = this.cancelableLoad.promise;

    this.setState(
      {
        value: null,
        isInProgress: !this.props.delay,
        hasError: false,
        hasTimedOut: false,
      },
      () => {
        const promises: Array<Promise<Partial<State<T | null>>>> = [];

        promises.push(
          loadPromise.then(
            value =>
              // tslint:disable-next-line:no-object-literal-type-assertion
              ({
                value,
                isPastDelay: false,
              } as Partial<SuccessResult<T>>),
          ),
        );

        if (this.props.delay) {
          promises.push(
            delay(this.props.delay).then(
              () =>
                ({
                  // tslint:disable-next-line:no-object-literal-type-assertion
                  isInProgress: true,
                  isPastDelay: true,
                } as Partial<PendingResult>),
            ),
          );
        }

        const { timeout } = this.props;
        if (timeout) {
          promises.push(
            delay(timeout).then(
              () =>
                // tslint:disable-next-line:no-object-literal-type-assertion
                ({
                  hasError: true,
                  hasTimedOut: true,
                } as Partial<ErrorResult>),
            ),
          );
        }

        Promise.race(promises)
          .then(async patch => {
            this.setState(patch as any);

            if (!patch.hasTimedOut) {
              const value = await loadPromise;
              this.setState({ value, isInProgress: false });
            }
          })
          .catch(error => {
            if (isCancelRejection(error)) {
              return;
            }

            this.setState({ isInProgress: false, hasError: true });
          });
      },
    );
  };

  componentDidMount() {
    this.tryLoading();
  }

  componentWillUnmount() {
    if (this.cancelableLoad) {
      this.cancelableLoad.cancel();
    }
  }

  render() {
    return this.props.children({ result: this.state, retry: this.tryLoading });
  }
}
