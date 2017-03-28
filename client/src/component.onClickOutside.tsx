import React = require('react')
import onClickOutside = require('react-onclickoutside')

interface Props {
  handleClickOutside(event: React.MouseEvent<any>): void
}

const OnClickOutsideWrapper = onClickOutside(class extends React.Component<any, any> {
  render() {
    return this.props.children
  }
})

export default class OnClickOutside extends React.Component<Props, any> {
  handleClickOutside(event: React.MouseEvent<any>) {
    this.props.handleClickOutside(event)
  }

  render() {
    return (
      <OnClickOutsideWrapper
        handleClickOutside={(event: React.MouseEvent<any>) => this.handleClickOutside(event)}
        eventTypes={['click']}
      >
        {this.props.children}
      </OnClickOutsideWrapper>
    )
  }
}
