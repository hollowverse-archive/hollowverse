import * as React from 'react';

import { resolve as resolveComponent } from 'react-resolver';
import {
  ErrorResult,
  SuccessResult,
  PendingResult,
  errorResult,
  pendingResult,
} from 'helpers/asyncResults';
import { once } from 'lodash';

type ChildProps<T> = { result: State<T>['result'] };

type Props<T> = {
  /**
   * Time in milliseconds after which loading is considered to have failed
   * Defaults to `6000`. If `null`, loading never times out.
   */
  timeout?: number | null;

  load(): Promise<T>;

  children(props: ChildProps<T>): JSX.Element | null;
};

type State<T> = {
  result: ErrorResult | SuccessResult<T> | PendingResult;
};

/**
 * Wraps `react-resolver`'s `resolve()` and exposes a render prop API instead of a HOC API.
 * It also allows children to render while loading instead of rendering nothing.
 * 
 * Use this component to prepare asynchronous data for server-side rendering.
 * `props.load()` is called on the server and the results are awaited and passed
 * to the wrapped component to render before sending the response.
 */
export class ResolvableComponent<T = any> extends React.PureComponent<
  Props<T>,
  State<T>
> {
  component: Props<T>['children'];

  componentWillMount() {
    this.component = resolveComponent<ChildProps<T>, ChildProps<T>>({
      result: once(
        async ({ value: currentValue }) =>
          new Promise<State<T>['result']>(async (resolve, reject) => {
            try {
              let value = currentValue;
              if (!value) {
                this.setState({ result: pendingResult });
                value = await this.props.load();
              }
              const result: State<T>['result'] = {
                isInProgress: false,
                hasError: false,
                value,
              };

              this.setState({ result });

              resolve(result);
            } catch (e) {
              this.setState({ result: errorResult });
              reject(errorResult);
            }
          }),
      ),
    })(this.props.children);
  }

  render() {
    const { result } = this.state;
    const Child =
      result && result.isInProgress ? this.props.children : this.component;

    return <Child result={result} />;
  }
}
