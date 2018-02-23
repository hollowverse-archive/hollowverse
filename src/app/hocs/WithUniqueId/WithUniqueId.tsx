import React from 'react';

type Props = {
  seed?: number;
  children(result: { id: string }): React.ReactNode;
};

export class WithUniqueId extends React.PureComponent<Props> {
  counter = 0;

  getId() {
    this.counter += 1;

    return this.counter;
  }

  render() {
    return this.props.children({ id: String(this.getId()) });
  }
}
