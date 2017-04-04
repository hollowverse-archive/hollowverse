import React = require('react')

interface Props {
  onSubmit?: React.EventHandler<React.FormEvent<HTMLFormElement>>
}

export class Form extends React.Component<Props & React.HTMLAttributes<HTMLFormElement>, undefined> {
  render() {
    const {props: p} = this
    const {onSubmit, ...rest} = p

    return (
      <form onSubmit={(event) => this.onSubmit(event)} {...rest}>
        {p.children}
      </form>
    )
  }

  onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    this.props.onSubmit && this.props.onSubmit(event)
  }
}
