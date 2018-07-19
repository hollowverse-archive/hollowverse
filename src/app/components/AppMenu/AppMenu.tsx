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

import { LoadingSpinner } from 'components/LoadingSpinner/LoadingSpinner';
import { AuthState } from 'store/types';
import { MessageWithIcon } from '../MessageWithIcon/MessageWithIcon';
import { warningIcon } from 'pages/NotablePerson/warningIcon';
import { Dialog } from 'components/Dialog/Dialog';
import { Paper } from '../Paper/Paper';

import facebookIcon from 'icons/facebook.svg';
import closeIcon from 'icons/close.svg';
import classes from './AppMenu.module.scss';
import { forceReload } from 'helpers/forceReload';

import Snackbar from '@material-ui/core/Snackbar';
import Button from '@material-ui/core/Button';

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
  initializing: 'Checking login...',
  loggingIn: 'Checking login...',
  loggingOut: 'Logging out...',
  loggedIn: 'Log out',
  loggedOut: 'Log in with Facebook',
  error: 'Log in with Facebook',
};

const spinner = <LoadingSpinner size={24} />;
const fbIcon = (
  <SvgIcon
    className={classes.facebookIcon}
    color="var(--facebook-blue)"
    size={20}
    {...facebookIcon}
  />
);

const iconForAuthState: Partial<Record<AuthState['state'], React.ReactNode>> = {
  loggedOut: fbIcon,
  loggedIn: null,
  loggingIn: spinner,
  loggingOut: spinner,
  initializing: spinner,
  error: fbIcon,
};

type State = {
  isFbSdkBlockedDialogShown: boolean;
  isLoginFailedDialogShown: boolean;
  isLoginStateChangeSnackbarShown: boolean;
};

export class AppMenu extends React.PureComponent<Props, State> {
  state = {
    isFbSdkBlockedDialogShown: false,
    isLoginFailedDialogShown: false,
    isLoginStateChangeSnackbarShown: false,
  };

  componentWillReceiveProps({ authState }: Props) {
    this.setState({
      isLoginStateChangeSnackbarShown:
        authState.state !== this.props.authState.state &&
        !(
          this.props.authState.state === 'initializing' &&
          authState.state === 'loggedOut'
        ),
    });
  }

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

  renderFbSdkBlockedDialog = () => {
    return (
      <Dialog
        alert
        titleText="Could not connect to Facebook"
        onExit={this.toggleFbSdkBlockedDialog}
        mounted={this.state.isFbSdkBlockedDialogShown}
        focusDialog={false}
      >
        <MessageWithIcon
          title="We could not connect to Facebook"
          icon={warningIcon}
        />
        <p>This could be due to a slow network. Try reloading the page.</p>
        <p>
          If the issue persists, your browser might have a tracking protection
          feature which blocks loading of Facebook scripts.
        </p>
        <button onClick={forceReload}>Reload</button>
      </Dialog>
    );
  };

  renderLoginFailedDialog = () => {
    return (
      <Dialog
        alert
        titleText="Login failed"
        onExit={this.toggleLoginFailedDialog}
        mounted={this.state.isLoginFailedDialogShown}
      >
        <MessageWithIcon title="Login failed" icon={warningIcon} />
        <p>This could be due to a slow network. Try reloading the page.</p>
        <p>
          If the issue persists, it is most likely an issue on our side. Please
          try again in a few hours.
        </p>
        <button onClick={forceReload}>Reload</button>
      </Dialog>
    );
  };

  toggleFbSdkBlockedDialog = () => {
    this.setState(state => ({
      isFbSdkBlockedDialogShown: !state.isFbSdkBlockedDialogShown,
    }));
  };

  toggleLoginFailedDialog = () => {
    this.setState(state => ({
      isLoginFailedDialogShown: !state.isLoginFailedDialogShown,
    }));
  };

  handleLoginClick = () => {
    const { authState, requestLogin, requestLogout } = this.props;

    if (authState.state === 'loggedIn') {
      requestLogout(undefined);
    } else if (authState.state === 'loggedOut') {
      requestLogin(undefined);
    } else if (
      authState.state === 'error' &&
      authState.code === 'FB_INIT_ERROR'
    ) {
      this.toggleFbSdkBlockedDialog();
    } else if (authState.state === 'error') {
      this.toggleLoginFailedDialog();
    }
  };

  renderLoginStateChangeSnackbar() {
    let message: React.ReactElement<any> | undefined;
    const { authState } = this.props;

    if (authState.state === 'loggedIn') {
      message = (
        <span>
          Logged in as <b>{authState.viewer.name}</b>
        </span>
      );
    } else if (authState.state === 'loggedOut') {
      message = <span>Logged out</span>;
    } else if (authState.state === 'error') {
      message = <span>Login failed</span>;
    }

    if (!message) {
      return undefined;
    }

    return (
      <Snackbar
        anchorOrigin={{
          horizontal: 'left',
          vertical: 'bottom',
        }}
        open={this.state.isLoginStateChangeSnackbarShown}
        onClose={this.toggleLoginStateChangeSnackbar}
        autoHideDuration={6000}
        message={message}
        action={
          <Button
            key="undo"
            color="secondary"
            size="small"
            onClick={this.toggleLoginStateChangeSnackbar}
          >
            Dismiss
          </Button>
        }
      />
    );
  }

  toggleLoginStateChangeSnackbar = () => {
    this.setState(state => ({
      isLoginStateChangeSnackbarShown: !state.isLoginStateChangeSnackbarShown,
    }));
  };

  closeMenu = () => {
    closeMenu('app-menu-wrapper');
  };

  render() {
    const { getMenuStyle = () => undefined } = this.props;

    return (
      <nav className={classes.root}>
        {this.renderFbSdkBlockedDialog()}
        {this.renderLoginFailedDialog()}
        {this.renderLoginStateChangeSnackbar()}
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
