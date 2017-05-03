import * as React from 'react'
import {connect} from 'react-redux'
import {actions} from '../redux/actions'
import {State} from '../redux/reducers'
import {Link} from 'react-router-dom'
import {pick} from '../utils/utils'
import {Header} from './header'
import {GlobalSpinner} from '../components/globalSpinner'

interface Props {
  loginStatus: facebookSdk.LoginStatus,
}

function mapStateToProps(state: State): Props {
  return pick(state, [
    'loginStatus',
  ])
}

const actionCreators = pick(actions, [
  'requestUpdateLoginStatus',
])
type ActionCreators = typeof actionCreators

class AppClass extends React.Component<ActionCreators & Props, undefined> {
  componentDidMount() {
    this.props.requestUpdateLoginStatus()
  }
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

export const App = connect(mapStateToProps, actionCreators)(AppClass)
