import {css} from 'aphrodite/no-important'
import * as React from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'
import {GlobalSpinner} from '../components/globalSpinner'
import {actions} from '../redux/actions'
import {State} from '../redux/reducers'
import {pick} from '../utils/utils'
import {styles} from './app.styles'
import {Header} from './header'

interface IProps {
  loginStatus: facebookSdk.LoginStatus,
}

function mapStateToProps(state: State): IProps {
  return pick(state, [
    'loginStatus',
  ])
}

const actionCreators = pick(actions, [
  'requestUpdateLoginStatus',
])
type ActionCreators = typeof actionCreators

class AppClass extends React.Component<ActionCreators & IProps, undefined> {
  componentDidMount() {
    this.props.requestUpdateLoginStatus()
  }
  render() {
    return (
      <div className={css(styles.mainApp)}>
        <GlobalSpinner/>
        <Header/>
        <div className={css(styles.pageContent)}>
          {this.props.children}
        </div>
      </div>
    )
  }
}

export const App = connect(mapStateToProps, actionCreators)(AppClass)
