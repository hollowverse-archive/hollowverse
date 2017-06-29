import * as React from 'react';

interface IProps {
  onSubmit?: React.EventHandler<React.FormEvent<HTMLFormElement>>;
}

export class Form extends React.Component<
  IProps & React.HTMLAttributes<HTMLFormElement>,
  undefined
> {
  render() {
    const { props: p } = this;
    const { onSubmit, children, ...rest } = p;

    return (
      <form onSubmit={event => this.onSubmit(event)} {...rest}>
        {children}
      </form>
    );
  }

  onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    this.props.onSubmit && this.props.onSubmit(event);
  }
}
