import * as React from 'react'

export class Input extends React.Component<any, undefined> {
  render() {
    const {props: p} = this
    const {onChange, onTextChange, ...rest} = p

    return (
    <input onChange={(event) => this.onTextChange(event)} {...rest} />
    )
  }

  onTextChange(event: any) {
    const {props: p} = this
    const value: string = event.target.value

    if (typeof p.onChange === 'function') {
      p.onChange(event)
    }

    if (typeof p.onTextChange === 'function') {
      p.onTextChange(value)
    }
  }
}
