import * as React from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'
import {Header} from './header'
import {GlobalSpinner} from '../components/globalSpinner'

class AppClass extends React.Component<{}, undefined> {
  render() {
    return (
      <div className='mainApp'>
        <GlobalSpinner/>
        <Header/>
        <div className='pageContent'>
          {this.props.children}
        </div>
      </div>
    )
  }
}

export const App = connect()(AppClass)
