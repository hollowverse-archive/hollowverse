import * as React from 'react';

interface Props {
  onSubmit?: React.EventHandler<React.FormEvent<HTMLFormElement>>;
}

export class Form extends React.PureComponent<
  Props & React.HTMLAttributes<HTMLFormElement>,
  {}
> {
  render() {
    const { props: p } = this;
    const { onSubmit, children, ...rest } = p;

    return (
      <form onSubmit={this.onSubmit} {...rest}>
        {children}
      </form>
    );
  }

  onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const { onSubmit } = this.props;

    if (onSubmit) {
      onSubmit(event);
    }
  };
}
