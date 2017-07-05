import { css } from 'aphrodite/no-important';
import * as React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { common } from 'common.styles';
import { requestLogin, requestLogout } from 'store/features/auth/actions';
import { StoreState } from 'store/types';
import pick from 'lodash/pick';
import { styles } from './header.styles';

interface Props {
  loginStatus: facebookSdk.LoginStatus;
}

function mapStateToProps(state: StoreState): Props {
  return pick(state, ['loginStatus']);
}

const actionCreators = {
  requestLogin,
  requestLogout,
};

type ActionCreators = typeof actionCreators;

class HeaderClass extends React.PureComponent<ActionCreators & Props, {}> {
  render() {
    return (
      <div className={css(common.palette, styles.navBar)}>
        {/*<i className={`fa fa-bars fa-2x ${css(styles.navBarIcon)}`}/>*/}
        <Link className={css(common.titleTypography, styles.textLogo)} to="/">
          HOLLOWVERSE
        </Link>
        {/*<i className={`${icon} ${css(styles.navBarIcon)}`} onClick={action}/>*/}
      </div>
    );
  }

  renderLoginVariants(): { icon: string; action(): void } {
    const { props: p } = this;

    if (p.loginStatus === 'connected') {
      return {
        icon: 'fa fa-sign-in fa-2x',
        action: () => p.requestLogout(undefined),
      };
    } else {
      return {
        icon: 'fa fa-sign-out fa-2x',
        action: () => p.requestLogin(undefined),
      };
    }
  }
}

export const Header = connect(mapStateToProps, actionCreators)(HeaderClass);
