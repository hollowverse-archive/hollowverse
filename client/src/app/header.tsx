import {css} from 'aphrodite/no-important'
import {push} from 'connected-react-router'
import * as React from 'react'
import {connect} from 'react-redux'
import {RouteComponentProps} from 'react-router-dom'
import {common} from '../common.styles'
import {actions} from '../redux/actions'
import {State} from '../redux/reducers'
import {pick} from '../utils/utils'
import {styles} from './header.styles'

interface IProps {
  loginStatus: facebookSdk.LoginStatus,
}

function mapStateToProps(state: State): IProps {
  return pick(state, [
    'loginStatus',
  ])
}

const actionCreators = pick(actions, [
  'requestLogin',
  'requestLogout',
])

type ActionCreators = typeof actionCreators
type ComponentProps = ActionCreators & IProps & RouteComponentProps<any>

class HeaderClass extends React.Component<ComponentProps, undefined> {
  render() {
    const {icon, action} = this.renderLoginVariants()
    return (
        <div className={css(common.palette, styles.navBar)}>
          {/*<i className={`fa fa-bars fa-2x ${css(styles.navBarIcon)}`}/>*/}
            <button
              className={css(common.titleTypography, styles.textLogo)}
              onClick={() => push('/')}
            >
              HOLLOWVERSE
            </button>
          {/*<i className={`${icon} ${css(styles.navBarIcon)}`} onClick={action}/>*/}
        </div>
    )
  }

  renderLoginVariants(): {icon: string, action: () => void} {
    const { props: p } = this

    if (p.loginStatus === 'connected') {
      return {
        icon: 'fa fa-sign-in fa-2x',
        action: () => p.requestLogout(),
      }
    } else {
      return {
        icon: 'fa fa-sign-out fa-2x',
        action: () => p.requestLogin(),
      }
    }
  }
}

export const Header = connect(mapStateToProps, actionCreators)(HeaderClass)
