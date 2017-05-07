import * as React from 'react'
import {css} from 'aphrodite/no-important'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'
import {actions} from '../redux/actions'
import {State} from '../redux/reducers'
import {pick, cn} from '../utils/utils'
import {FadeInDown} from '../components/animations'
import OnClickOutside from '../components/onClickOutside'
import {Icon} from '../components/icon'
import {styles} from './header.styles'

interface Props {
  loginStatus: facebookSdk.LoginStatus,
  isNavMenuOpen: boolean
}

function mapStateToProps(state: State): Props {
  return pick(state, [
    'loginStatus',
    'isNavMenuOpen',
  ])
}

const actionCreators = pick(actions, [
  'requestLogin',
  'requestLogout',
  'setIsNavMenuOpen',
])
type ActionCreators = typeof actionCreators

class HeaderClass extends React.Component<ActionCreators & Props, undefined> {
  render() {
    const {props: p} = this
    const navClass = (p.isNavMenuOpen) ? 'is-active' : ''

    return (
        <div className={css(styles.navBar)}>
          <i className={`fa fa-bars fa-2x ${css(styles.navBarIcon)}`}/>
          <h1 className={css(styles.textLogo)}>HOLLOWVERSE</h1>
          <i className={`fa fa-sign-in fa-2x ${css(styles.navBarIcon)}`} onClick={() => p.requestLogin()}/>
        </div>
    )
      /*
    return (
      <nav className='nav has-shadow'>
        <div className='container'>
          <div className='nav-left'>
            <div className='nav-item'>
              <h1 className='title'><Link to='/'>Hollowverse</Link></h1>
            </div>
          </div>

          <span
            className={cn('nav-toggle ignore-react-onclickoutside', navClass)}
            onClick={() => this.toggleIsNavMenuOpen()}
          >
            <span/>
            <span/>
            <span/>
          </span>

          {this.renderMenuItems(navClass, {isHiddenMobile: true})}

          <FadeInDown>
            {p.isNavMenuOpen && (
              <OnClickOutside handleClickOutside={() => p.setIsNavMenuOpen(false)}>
                {this.renderMenuItems(navClass)}
              </OnClickOutside>
            )}
          </FadeInDown>
        </div>
      </nav>
    )
    */
  }

  renderMenuItems(navClass: string, config: {isHiddenMobile?: boolean} = {}) {
    const { props: p } = this

    return (
      <div
        className={cn('nav-menu nav-right', navClass, {'is-hidden-mobile': config.isHiddenMobile})}
        onClick={() => p.setIsNavMenuOpen(false)}
      >
        {(p.loginStatus === 'connected') && (
          <a className='nav-item' onClick={() => p.requestLogout()}>Logout</a>
        ) || (
            <a className='nav-item' onClick={() => p.requestLogin()}>
              Login with Facebook
            <Icon name='facebook-official' size={16} className='facebookIcon'/>
            </a>
          )}
      </div>
    )
  }

  toggleIsNavMenuOpen() {
    this.props.setIsNavMenuOpen(!this.props.isNavMenuOpen)
  }
}

export const Header = connect(mapStateToProps, actionCreators)(HeaderClass)
