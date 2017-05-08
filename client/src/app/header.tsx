import * as React from 'react'
import {css} from 'aphrodite/no-important'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'
import {actions} from '../redux/actions'
import {State} from '../redux/reducers'
import {pick} from '../utils/utils'
import {styles} from './header.styles'

interface Props {
  loginStatus: facebookSdk.LoginStatus,
}

function mapStateToProps(state: State): Props {
  return pick(state, [
    'loginStatus',
  ])
}

const actionCreators = pick(actions, [
  'requestLogin',
  'requestLogout',
])

type ActionCreators = typeof actionCreators

class HeaderClass extends React.Component<ActionCreators & Props, undefined> {
  render() {
    return (
        <div className={css(styles.navBar)}>
          <i className={`fa fa-bars fa-2x ${css(styles.navBarIcon)}`}/>
          <h1 className={css(styles.textLogo)}>HOLLOWVERSE</h1>
          {this.renderLoginOptions()}
        </div>
    )
  }

  renderLoginOptions() {
    const { props: p } = this
    if (p.loginStatus === 'connected') {
      return (
        <i className={`fa fa-sign-out fa-2x ${css(styles.navBarIcon)}`} onClick={() => p.requestLogout()} />
      )
    } else {
      return (
        <i className={`fa fa-sign-in fa-2x ${css(styles.navBarIcon)}`} onClick={() => p.requestLogin()} />
      )
    }
  }

}

export const Header = connect(mapStateToProps, actionCreators)(HeaderClass)
