import React = require('react')
import {cn} from '../utils/utils'

interface Props {
  name: string,
  size?: 16
}

export class Icon extends React.Component<Props & React.HTMLAttributes<HTMLElement>, undefined> {
  static defaultProps: Partial<Props> = {
    size: 16
  }

  render() {
    const {name, size, className, style, ...rest} = this.props

    return (
      <i className={cn(`fa fa-${name}`, className)} style={{...style, fontSize: size}} {...rest} />
    )
  }
}
