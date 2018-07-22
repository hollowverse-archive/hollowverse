import React from 'react';
import cc from 'classcat';

import { SvgIcon } from 'components/SvgIcon/SvgIcon';

import { LoadingSpinner } from 'components/LoadingSpinner/LoadingSpinner';
import { AuthState, AuthErrorCode } from 'store/types';

import facebookIcon from 'icons/facebook.svg';
// import closeIcon from 'icons/close.svg';
import classes from './AppMenu.module.scss';
import { forceReload } from 'helpers/forceReload';

import Snackbar from '@material-ui/core/Snackbar';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import MenuIcon from '@material-ui/icons/Menu';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';

import { MenuItemWithLink, InertMenuItem } from './MenuItem';
import { callAll } from 'helpers/callAll';

export type StateProps = {
  authState: AuthState;
};

export type DispatchProps = {
  requestLogin(payload: undefined): void;
  requestLogout(payload: undefined): void;
};

export type OwnProps = {};

type Props = OwnProps & StateProps & DispatchProps;

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

const dialogContentForErrorCode: Partial<
  Record<AuthErrorCode, React.ReactNode>
> = {
  FB_INIT_ERROR: (
    <p>
      If the issue persists, your browser might have a tracking protection
      feature which blocks loading of Facebook scripts.
    </p>
  ),
  UNKNOWN_ERROR: (
    <p>
      If the issue persists, it is most likely an issue on our side. Please try
      again in a few hours.
    </p>
  ),
};

const titleForErrorCode: Partial<Record<AuthErrorCode, string>> = {
  FB_INIT_ERROR: 'Could not connect to Facebook',
  UNKNOWN_ERROR: 'Login failed',
};

type State = {
  isLoginFailedDialogShown: boolean;
  isLoginStateChangeSnackbarShown: boolean;
  anchorElement: HTMLElement | null;
};

export class AppMenu extends React.PureComponent<Props, State> {
  state = {
    isLoginFailedDialogShown: false,
    isLoginStateChangeSnackbarShown: false,
    anchorElement: null,
  };

  componentWillReceiveProps({ authState }: Props) {
    this.setState({
      isLoginStateChangeSnackbarShown:
        authState.state !== this.props.authState.state &&
        !(
          this.props.authState.state === 'initializing' &&
          authState.state === 'loggedOut'
        ),
      isLoginFailedDialogShown:
        authState.state !== this.props.authState.state &&
        authState.state === 'error' &&
        authState.code !== 'FB_INIT_ERROR',
    });
  }

  renderUser = () => {
    const { authState } = this.props;

    if (authState.state !== 'loggedIn') {
      return undefined;
    }

    const { viewer } = authState;

    return (
      <InertMenuItem aria-label={`Signed in as ${viewer.name}`}>
        <ListItemIcon>
          <Avatar alt="Profile Photo" src={viewer.photoUrl || undefined} />
        </ListItemIcon>
        {viewer.name}
      </InertMenuItem>
    );
  };

  renderLoginButton = () => {
    const {
      authState: { state },
    } = this.props;

    const canClick =
      state === 'loggedIn' || state === 'loggedOut' || state === 'error';

    const icon = iconForAuthState[state];

    return (
      <MenuItem
        id="login-button"
        button
        className={cc([
          {
            [classes.facebook]: state === 'loggedOut' || state === 'error',
          },
        ])}
        onClick={callAll(this.handleLoginClick, this.handleClose)}
        disabled={!canClick}
        divider
      >
        {icon && <ListItemIcon>{icon as any}</ListItemIcon>}
        {messageForAuthState[state] || messageForAuthState.loggedOut}
      </MenuItem>
    );
  };

  renderLoginFailedDialog = () => {
    const { authState } = this.props;

    if (authState.state !== 'error') {
      return undefined;
    }

    const { code = 'UNKNOWN_ERROR' } = authState;

    return (
      <Dialog
        aria-labelledby="login-failed-dialog-title"
        role="alertdialog"
        onClose={this.toggleLoginFailedDialog}
        open={this.state.isLoginFailedDialogShown}
      >
        <DialogTitle id="login-failed-dialog-title">
          {titleForErrorCode[code] || titleForErrorCode.UNKNOWN_ERROR}
        </DialogTitle>
        <DialogContent>
          <p>This could be due to a slow network. Try reloading the page.</p>
          {dialogContentForErrorCode[code] || titleForErrorCode.UNKNOWN_ERROR}
        </DialogContent>
        <DialogActions>
          <Button onClick={forceReload}>Reload</Button>
          <Button onClick={this.toggleLoginFailedDialog}>Dismiss</Button>
        </DialogActions>
      </Dialog>
    );
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
    } else if (authState.state === 'error') {
      this.toggleLoginFailedDialog();
    }
  };

  renderLoginStateChangeSnackbar() {
    const { authState } = this.props;

    let message: React.ReactElement<any> | undefined;
    if (authState.state === 'loggedIn') {
      message = (
        <span>
          Logged in as <b>{authState.viewer.name}</b>
        </span>
      );
    } else if (authState.state === 'loggedOut') {
      message = <span>Logged out</span>;
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

  handleClick = (event: React.MouseEvent<any>) => {
    this.setState({ anchorElement: event.currentTarget });
  };

  handleClose = () => {
    this.setState({ anchorElement: null });
  };

  render() {
    const { anchorElement } = this.state;

    return (
      <>
        {this.renderLoginFailedDialog()}
        {this.renderLoginStateChangeSnackbar()}
        <IconButton
          style={{ visibility: 'hidden' }}
          aria-owns={anchorElement ? 'app-menu' : undefined}
          aria-haspopup="true"
          aria-label="Open menu"
          onClick={this.handleClick}
        >
          <MenuIcon />
        </IconButton>
        {!!anchorElement && (
          <nav>
            <Menu
              id="app-menu"
              anchorEl={anchorElement}
              open={Boolean(anchorElement)}
              onClose={this.handleClose}
            >
              {this.renderUser()}
              <MenuItemWithLink onClick={this.handleClose} to="/">
                Home
              </MenuItemWithLink>
              <MenuItemWithLink
                onClick={this.handleClose}
                divider
                to="/contact"
              >
                Contact
              </MenuItemWithLink>
              {this.renderLoginButton()}
              <MenuItemWithLink onClick={this.handleClose} to="/privacy-policy">
                <Typography color="textSecondary">Privacy Policy</Typography>
              </MenuItemWithLink>
            </Menu>
          </nav>
        )}
      </>
    );
  }
}
