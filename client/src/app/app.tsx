import {css} from 'aphrodite/no-important'
import * as React from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'
import {GlobalSpinner} from '../components/globalSpinner'
import {Warning} from '../components/warning'
import {actions} from '../redux/actions'
import {State} from '../redux/reducers'
import pick from 'lodash/pick'
import {styles} from './app.styles'
import {Header} from './header'

interface IProps {
  loginStatus: facebookSdk.LoginStatus,
  displayWarning: boolean
}

function mapStateToProps(state: State): IProps {
  return pick(state, [
    'loginStatus',
    'displayWarning',
  ])
}

const actionCreators = pick(actions, [
  'requestUpdateLoginStatus',
  'toggleWarning',
])

type ActionCreators = typeof actionCreators

class AppClass extends React.Component<ActionCreators & IProps, undefined> {
  componentDidMount() {
    this.props.requestUpdateLoginStatus()
    this.props.toggleWarning(true)
  }
  render() {
    const {props: p} = this
    return (
      <div className={css(styles.mainApp)}>
        <GlobalSpinner/>
        <Header/>
        <Warning/>
        <div className={css(styles.pageContent)}>
          {this.props.children}
        </div>
      </div>
    )
  }
}

export const App = connect(mapStateToProps, actionCreators)(AppClass)
