import * as React from 'react';

export function createContext<T>() {
  type ProviderProps = {
    createContext(): T;
  };

  class Provider extends React.PureComponent<ProviderProps> {
    getChildContext(): T {
      return this.props.createContext();
    }

    render() {
      return this.props.children;
    }
  }

  type ConsumerProps = {
    children(context: T): React.ReactNode;
  };

  class Consumer extends React.PureComponent<ConsumerProps> {
    context: T;

    render() {
      return this.props.children(this.context);
    }
  }

  return { Provider, Consumer };
}
