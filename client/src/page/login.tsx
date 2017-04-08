import * as React from 'react'
import {connect} from 'react-redux'

class CreateNewProfile extends React.Component<undefined, undefined> {
  render() {
    return (
      <div>Please login first</div>
    )
  }
}

export default connect()(CreateNewProfile)
