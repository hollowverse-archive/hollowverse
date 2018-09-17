// tslint:disable function-name
/* eslint-disable camelcase */
import React from 'react';
import cc from 'classcat';

import { SvgIcon } from 'components/SvgIcon/SvgIcon';

import { AuthenticationState, AuthenticationErrorCode } from 'store/types';

import facebookIcon from 'icons/facebook.svg';
import { forceReload } from 'helpers/forceReload';

import Snackbar from '@material-ui/core/Snackbar';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContentText from '@material-ui/core/DialogContentText';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import MenuIcon from '@material-ui/icons/Menu';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import Tooltip from '@material-ui/core/Tooltip';
import Switch from '@material-ui/core/Switch';
import ListItemText from '@material-ui/core/ListItemText';

import { MenuItemWithLink, InertMenuItem } from './MenuItem';
import { callAll } from 'helpers/callAll';
import {
  createStyles,
  withStyles,
  Theme,
  WithStyles,
} from '@material-ui/core/styles';
import {
  UncontrolledMenu,
  UncontrolledMenuItemProps,
  UncontrolledMenuButtonProps,
} from '../UncontrolledMenu/UncontrolledMenu';

export type StateProps = {
  authState: AuthenticationState;
  isNightModeEnabled: boolean;
};

export type DispatchProps = {
  requestLogin(payload: undefined): void;
  requestLogout(payload: undefined): void;
  toggleNightMode(payload: undefined): void;
};

export type OwnProps = {};

const styles = ({ palette }: Theme) =>
  createStyles({
    facebook: {
      '--facebook-blue':
        palette.type === 'light'
          ? '#4267b2'
          : palette.getContrastText(palette.background.paper),
      color: 'var(--facebook-blue)',
    },
  });

type Props = OwnProps &
  StateProps &
  DispatchProps &
  WithStyles<ReturnType<typeof styles>>;

const messageForAuthState: Partial<
  Record<AuthenticationState['state'], string>
> = {
  initializing: 'Checking login...',
  loggingIn: 'Checking login...',
  loggingOut: 'Logging out...',
  loggedIn: 'Log out',
  loggedOut: 'Log in with Facebook',
  error: 'Log in with Facebook',
};

const spinner = (
  <ListItemIcon>
    <CircularProgress size={24} />
  </ListItemIcon>
);

const fbIcon = (
  <SvgIcon color="var(--facebook-blue)" size={20} {...facebookIcon} />
);

const iconForAuthState: Partial<
  Record<AuthenticationState['state'], React.ReactNode>
> = {
  loggedOut: fbIcon,
  loggedIn: null,
  loggingIn: spinner,
  loggingOut: spinner,
  initializing: spinner,
  error: fbIcon,
};

const dialogContentForErrorCode: Partial<
  Record<AuthenticationErrorCode, React.ReactNode>
> = {
  FB_INIT_ERROR: (
    <DialogContentText>
      If the issue persists, your browser might have a tracking protection
      feature which blocks loading of Facebook scripts.
    </DialogContentText>
  ),
  UNKNOWN_ERROR: (
    <DialogContentText>
      If the issue persists, it is most likely an issue on our side. Please try
      again in a few hours.
    </DialogContentText>
  ),
};

const titleForErrorCode: Partial<Record<AuthenticationErrorCode, string>> = {
  FB_INIT_ERROR: 'Could not connect to Facebook',
  UNKNOWN_ERROR: 'Login failed',
};

type State = {
  isLoginFailedDialogShown: boolean;
  isLoginStateChangeSnackbarShown: boolean;
};

const renderMenuButton = (buttonProps: UncontrolledMenuButtonProps) => (
  <Tooltip title="Main Menu">
    <IconButton aria-label="Open menu" {...buttonProps}>
      <MenuIcon />
    </IconButton>
  </Tooltip>
);

export const AppMenu = withStyles(styles)(
  class extends React.PureComponent<Props, State> {
    state = {
      isLoginFailedDialogShown: false,
      isLoginStateChangeSnackbarShown: false,
    };

    UNSAFE_componentWillReceiveProps({ authState }: Props) {
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

    renderLoginButton = (menuItemProps: UncontrolledMenuItemProps) => {
      const {
        authState: { state },
        classes,
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
          {...menuItemProps}
          onClick={callAll(menuItemProps.onClick, this.handleLoginClick)}
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
            <DialogContentText>
              This could be due to a slow network. Try reloading the page.
            </DialogContentText>
            {dialogContentForErrorCode[code] || titleForErrorCode.UNKNOWN_ERROR}
          </DialogContent>
          <DialogActions>
            <Button color="primary" onClick={forceReload}>
              Reload
            </Button>
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

    toggleNightMode = () => {
      this.props.toggleNightMode(undefined);
    };

    renderModeratorLinks = (menuItemProps: UncontrolledMenuItemProps) => {
      const { authState } = this.props;

      if (
        authState.state === 'loggedIn' &&
        authState.viewer.role === 'MODERATOR'
      ) {
        return [
          <MenuItemWithLink
            key="quotes"
            {...menuItemProps}
            to="/moderation/events"
          >
            Review user-submitted events
          </MenuItemWithLink>,
          <MenuItemWithLink
            key="users"
            divider
            {...menuItemProps}
            to="/moderation/users"
          >
            Manage users
          </MenuItemWithLink>,
        ];
      }

      return undefined;
    };

    render() {
      return (
        <>
          {this.renderLoginFailedDialog()}
          {this.renderLoginStateChangeSnackbar()}
          <nav>
            <UncontrolledMenu
              id="app-menu"
              anchorOrigin={{ horizontal: 'center', vertical: 'center' }}
              renderButton={renderMenuButton}
            >
              {menuItemProps => (
                <>
                  {this.renderUser()}
                  <MenuItemWithLink {...menuItemProps} to="/">
                    Home
                  </MenuItemWithLink>
                  <MenuItemWithLink {...menuItemProps} divider to="/contact">
                    Contact
                  </MenuItemWithLink>
                  {this.renderModeratorLinks(menuItemProps)}
                  {/* {this.renderLoginButton(menuItemProps)} */}
                  <MenuItem
                    {...menuItemProps}
                    onClick={callAll(
                      menuItemProps.onClick,
                      this.toggleNightMode,
                    )}
                    divider
                  >
                    <ListItemText>Night Mode</ListItemText>
                    <Switch checked={this.props.isNightModeEnabled} />
                  </MenuItem>
                  <MenuItemWithLink {...menuItemProps} to="/privacy-policy">
                    <Typography color="textSecondary">
                      Privacy Policy
                    </Typography>
                  </MenuItemWithLink>
                </>
              )}
            </UncontrolledMenu>
          </nav>
        </>
      );
    }
  },
);
