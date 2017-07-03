import * as React from 'react';

interface IProps {
  onTextChange?(value: string): void;
}

export class Input extends React.Component<
  IProps & React.HTMLAttributes<HTMLInputElement>,
  {}
> {
  render() {
    const { props: p } = this;
    const { onChange, onTextChange, ...rest } = p;

    return <input onChange={this.onTextChange} {...rest} />;
  }

  onTextChange = (event: React.FormEvent<HTMLInputElement>) => {
    const { props: p } = this;
    const value = event.currentTarget.value;

    if (typeof p.onChange === 'function') {
      p.onChange(event);
    }

    if (typeof p.onTextChange === 'function') {
      p.onTextChange(value);
    }
  };
}
