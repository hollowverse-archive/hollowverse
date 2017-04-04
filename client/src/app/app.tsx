import * as React from "react";
import {pick, cn} from '../utils/utils'
import {connect} from 'react-redux'
import {actions} from '../redux/actions'
import {State} from '../redux/reducers'
import {GlobalSpinner} from '../component/globalSpinner'
import {FadeInDown} from '../component/animations'
import OnClickOutside from '../component/onClickOutside'
import {Icon} from '../component/icon'
import {Link} from 'react-router'

interface Props {
  loginStatus: facebookSdk.LoginStatus,
  isNavMenuOpen: boolean
}

function mapStateToProps(state: State): Props {
  return pick(state, [
    'loginStatus',
    'isNavMenuOpen'
  ])
}

const actionCreators = pick(actions, [
  'requestLogin',
  'requestLogout',
  'requestUpdateLoginStatus',
  'setIsNavMenuOpen'
])
type ActionCreators = typeof actionCreators

class AppClass extends React.Component<ActionCreators & Props, undefined> {
  componentDidMount() {
    this.props.requestUpdateLoginStatus()
  }

  render() {
    const {props: p} = this
    const navClass = (p.isNavMenuOpen) ? 'is-active' : ''

    return (
      <div className="mainApp">
        <GlobalSpinner/>

        <nav className='nav has-shadow'>
          <div className="container">
            <div className="nav-left">
              <div className="nav-item">
                <h1 className="title"><Link to="/">Hollowverse</Link></h1>
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

        <div className="pageContent">
          {this.props.children}
        </div>

        <footer className="footer">
          <div className="container">
            <div className="content">
              <p>© 1884</p>
            </div>
          </div>
        </footer>
      </div>
    )
  }

  renderMenuItems(navClass: string, config: {isHiddenMobile?: boolean} = {}) {
    const {props: p} = this

    return (
      <div
        className={cn("nav-menu nav-right", navClass, {'is-hidden-mobile': config.isHiddenMobile})}
        onClick={() => p.setIsNavMenuOpen(false)}
      >
        {(p.loginStatus === 'connected') && (
          <a className="nav-item" onClick={() => p.requestLogout()}>Logout</a>
        ) || (
          <a className="nav-item" onClick={() => p.requestLogin()}>
            Login with Facebook
            <Icon name="facebook-official" size={16} className="facebookIcon"/>
          </a>
        )}
      </div>
    )
  }

  toggleIsNavMenuOpen() {
    this.props.setIsNavMenuOpen(!this.props.isNavMenuOpen)
  }
}

export const App = connect(mapStateToProps, actionCreators)(AppClass)
