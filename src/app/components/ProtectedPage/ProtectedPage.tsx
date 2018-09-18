import React from 'react';
import Helmet from 'react-helmet-async';
import { connect } from 'react-redux';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContentText from '@material-ui/core/DialogContentText';
import CircularProgress from '@material-ui/core/CircularProgress';
import withMobileDialog from '@material-ui/core/withMobileDialog';

import { MessageWithIcon } from 'components/MessageWithIcon/MessageWithIcon';

import { plural } from 'pluralize';

import {
  Protected,
  OwnProps as ProtectedProps,
} from 'components/Protected/Protected';
import { Status } from 'components/Status/Status';
import { LinkButton } from 'components/Button/Button';
import { requestLogin } from 'store/features/auth/actions';

import { forceReload } from 'helpers/forceReload';
import { AuthorizationState, Action } from 'store/types';
import { arrayToSentence } from 'helpers/arrayToSentence';

type DispatchProps = {
  requestLogin: typeof requestLogin;
};

type AuthorizationDialogProps = {
  pageTitle: string;
  title: string;
  content?: JSX.Element;
  actions: JSX.Element[];
} & Action<'SET_STATUS_CODE'>['payload'];

const AuthorizationFailureDialog = withMobileDialog<AuthorizationDialogProps>({
  breakpoint: 'xs',
})(props => {
  const {
    pageTitle,
    title,
    content,
    fullScreen,
    actions,
    children,
    ...rest
  } = props;

  return (
    <>
      <Status {...rest} />
      <Helmet>
        <title>{pageTitle}</title>
      </Helmet>
      <Dialog
        fullScreen={fullScreen}
        aria-labelledby="authroization-failure-dialog-title"
        role="alertdialog"
        open
      >
        <DialogTitle id="authroization-failure-dialog-title">
          {title}
        </DialogTitle>
        {content ? <DialogContent>{content}</DialogContent> : undefined}
        <DialogActions>
          <LinkButton to="/">Go to homepage</LinkButton>
          {actions}
        </DialogActions>
      </Dialog>
    </>
  );
});

type Props = ProtectedProps & DispatchProps;

/**
 * A wrapper around the `Protected` component with default fallback views
 * showing helpful instructions for non-authorized states:
 *
 * * Asks the user to log in and shows a login button if the user has not logged in
 * * Prevents rendering of `children` if the user is logged in but does not have
 * sufficient permissions and lists required roles
 *
 * Note: if `children` is function, this component will simply pass through all props
 * to `Protected`, i.e. it is up to the `children` function to decide whether to
 * prevent rendering of the page elements.
 */
export const ProtectedPage = connect(
  undefined,
  {
    requestLogin,
  },
)(
  class extends React.PureComponent<Props> {
    // Must be initialized first so we can access it in
    // `dialogPropsForAuthorizationState`
    requestLogin = () => {
      this.props.requestLogin(undefined);
    };

    getRolesAsSentence = () => {
      if (this.props.authorizedRoles === undefined) {
        throw new TypeError('Expected `authorizedRoles` to be defined');
      }

      return this.props.authorizedRoles
        .map(c => c.toLowerCase())
        .map(plural)
        .reduce(arrayToSentence());
    };

    // tslint:disable-next-line member-ordering
    dialogPropsForAuthorizationState: Partial<
      Record<AuthorizationState['state'], AuthorizationDialogProps>
    > = {
      loggedOut: {
        code: 401,
        title: 'This page requires login',
        pageTitle: 'Login Required',
        content: (
          <DialogContentText>
            Please log in so that we can check if you are allowed to access this
            page
          </DialogContentText>
        ),
        actions: [
          <Button color="primary" key="login" onClick={this.requestLogin}>
            Log in
          </Button>,
        ],
      },
      notAuthorized: {
        code: 403,
        title: 'You are not allowed to access this page',
        content: this.props.authorizedRoles ? (
          <DialogContentText>
            Only {this.getRolesAsSentence()} can access this page
          </DialogContentText>
        ) : (
          undefined
        ),
        pageTitle: 'Forbidden',
        actions: [],
      },
      error: {
        code: 500,
        title: 'We could not check if you are allowed to access this page',
        content: (
          <DialogContentText>
            This page requires authorization but we were not able to check if
            you are allowed to access it. Please try reloading this page.
          </DialogContentText>
        ),
        pageTitle: 'Error',
        actions: [
          <Button color="primary" key="reload" onClick={forceReload}>
            Reload
          </Button>,
        ],
      },
    };

    render() {
      const { children, authorizedRoles } = this.props;

      return (
        <Protected authorizedRoles={authorizedRoles}>
          {result => {
            if (typeof children === 'function') {
              return children(result);
            }

            const { state } = result;
            if (state === 'authorized') {
              return children;
            }

            const dialogProps = this.dialogPropsForAuthorizationState[state];

            if (dialogProps) {
              return <AuthorizationFailureDialog {...dialogProps} />;
            }

            return (
              <MessageWithIcon
                title="Checking your permissions..."
                icon={<CircularProgress size={50} />}
              />
            );
          }}
        </Protected>
      );
    }
  },
);
