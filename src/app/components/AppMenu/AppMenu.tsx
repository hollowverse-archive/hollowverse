import React from 'react';
import cc from 'classcat';
import { Menu, closeMenu } from 'react-aria-menubutton';
import CSSTransition, {
  CSSTransitionClassNames,
} from 'react-transition-group/CSSTransition';
import {
  MenuItemWithLink,
  MenuItemWithButton,
  MenuItemWithChild,
} from './MenuItem';

import { PersonPhoto } from 'components/PersonPhoto/PersonPhoto';
import { SvgIcon } from 'components/SvgIcon/SvgIcon';
import { Paper } from 'components/Paper/Paper';
import closeIcon from 'icons/close.svg';
import facebookIcon from 'icons/facebook.svg';

import classes from './AppMenu.module.scss';
import { LoadingSpinner } from 'components/LoadingSpinner/LoadingSpinner';
import { AuthState } from 'store/types';

const Separator = (
  <div role="separator" className={classes.separator}>
    <div />
  </div>
);

const transitionTimeoutMilliseconds = 150;

export type StateProps = {
  authState: AuthState;
};

export type DispatchProps = {
  requestLogin(payload: undefined): void;
  requestLogout(payload: undefined): void;
};

export type OwnProps = {
  getMenuStyle?(): React.CSSProperties & {
    '--top': string;
    '--left': string;
  };
};

type Props = OwnProps & StateProps & DispatchProps;

const transitionClassNames: CSSTransitionClassNames = {
  enter: classes.menuEnter,
  enterActive: classes.menuEnterActive,
  exit: classes.menuExit,
  exitActive: classes.menuExitActive,
};

const messageForAuthState: Partial<Record<AuthState['state'], string>> = {
  initializing: 'Checking log in...',
  loggingIn: 'Checking log in...',
  loggingOut: 'Logging out...',
  loggedIn: 'Log out',
  loggedOut: 'Log in with Facebook',
  error: 'Log in with Facebook',
};

const spinner = <LoadingSpinner size={24} />;
const fbIcon = (
  <SvgIcon className={classes.facebookIcon} size={20} {...facebookIcon} />
);

const iconForAuthState: Partial<Record<AuthState['state'], React.ReactNode>> = {
  loggedOut: fbIcon,
  loggedIn: null,
  loggingIn: spinner,
  loggingOut: spinner,
  initializing: spinner,
  error: fbIcon,
};

export class AppMenu extends React.PureComponent<Props> {
  renderUser = () => {
    const { authState } = this.props;

    if (authState.state !== 'loggedIn') {
      return undefined;
    }

    const { viewer } = authState;

    return (
      <MenuItemWithChild
        aria-label={`Signed in as ${viewer.name}`}
        factory="div"
        isClickable={false}
      >
        <PersonPhoto
          alt="Profile Photo"
          className={classes.userAvatar}
          src={viewer.photoUrl || undefined}
        />
        <div className={classes.userName}>{viewer.name}</div>
      </MenuItemWithChild>
    );
  };

  renderLoginButton = () => {
    const {
      authState: { state },
    } = this.props;
    const canClick =
      state === 'loggedIn' || state === 'loggedOut' || state === 'error';

    return (
      <MenuItemWithButton
        className={cc([
          {
            [classes.facebook]: state === 'loggedOut' || state === 'error',
          },
        ])}
        type="button"
        onClick={this.handleLoginClick}
        disabled={!canClick}
        icon={iconForAuthState[state]}
      >
        {messageForAuthState[state] || messageForAuthState.loggedOut}
      </MenuItemWithButton>
    );
  };

  handleLoginClick = () => {
    const { authState, requestLogin, requestLogout } = this.props;

    if (authState.state === 'loggedIn') {
      requestLogout(undefined);
    } else if (authState.state === 'loggedOut') {
      requestLogin(undefined);
    }
  };

  closeMenu = () => {
    closeMenu('app-menu-wrapper');
  };

  render() {
    const { getMenuStyle = () => undefined } = this.props;

    return (
      <nav className={classes.root}>
        <Menu
          className={classes.menu}
          aria-label="Main Menu"
          style={
            {
              '--timeout': `${transitionTimeoutMilliseconds}ms`,
            } as any
          }
        >
          {({ isOpen }: { isOpen: boolean }) => (
            <CSSTransition
              classNames={transitionClassNames}
              timeout={transitionTimeoutMilliseconds}
              in={isOpen}
              mountOnEnter
              unmountOnExit
            >
              <Paper className={classes.body} style={getMenuStyle()}>
                {this.renderUser()}
                <MenuItemWithLink to="/">Home</MenuItemWithLink>
                <MenuItemWithLink to="/contact">Contact</MenuItemWithLink>
                {Separator}
                {this.renderLoginButton()}
                <MenuItemWithButton
                  type="button"
                  className={classes.close}
                  onClick={this.closeMenu}
                  icon={<SvgIcon size={16} {...closeIcon} />}
                  aria-label="Close"
                />
                {Separator}
                <MenuItemWithLink size="small" to="/privacy-policy">
                  Privacy Policy
                </MenuItemWithLink>
              </Paper>
            </CSSTransition>
          )}
        </Menu>
      </nav>
    );
  }
}
