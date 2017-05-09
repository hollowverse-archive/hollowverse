import * as React from 'react'
import {css} from 'aphrodite/no-important'
import {connect} from 'react-redux'
import {actions} from '../redux/actions'
import {State} from '../redux/reducers'
import {Link} from 'react-router-dom'
import {pick} from '../utils/utils'
import {Header} from './header'
import {GlobalSpinner} from '../components/globalSpinner'
import {styles} from './app.styles'

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
