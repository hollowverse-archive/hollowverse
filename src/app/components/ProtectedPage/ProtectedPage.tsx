import React from 'react';
import Helmet from 'react-helmet-async';
import { connect } from 'react-redux';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import Typography from '@material-ui/core/Typography';

import { plural } from 'pluralize';

import {
  Protected,
  OwnProps as ProtectedProps,
} from 'components/Protected/Protected';
import { Status } from 'components/Status/Status';
import { requestLogin } from 'store/features/auth/actions';
import { withRouter, RouteComponentProps } from 'react-router';

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

const AuthorizationFailureDialog = (props: AuthorizationDialogProps) => {
  const { pageTitle, title, content, actions, ...rest } = props;

  return (
    <>
      <Status {...rest} />
      <Helmet>
        <title>{pageTitle}</title>
      </Helmet>
      <Dialog
        aria-labelledby="non-authorized-state-dialog-title"
        role="alertdialog"
        // onClose={goBack}
        open
      >
        <DialogTitle id="non-authorized-state-dialog-title">
          {title}
        </DialogTitle>
        {content ? <DialogContent>{content}</DialogContent> : undefined}
        <DialogActions>
          {/* <Button onClick={goBack}>Dismiss</Button> */}
          {actions}
        </DialogActions>
      </Dialog>
    </>
  );
};

type Props = ProtectedProps & DispatchProps & RouteComponentProps<any>;

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
export const ProtectedPage = withRouter(
  connect(
    undefined,
    {
      requestLogin,
    },
  )(
    class extends React.Component<Props> {
      // Must be initialized first so we can access it in
      // `dialogPropsForAuthorizationState`
      requestLogin = () => {
        this.props.requestLogin(undefined);
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
            <Typography>
              Please log in so that we can check if you are allowed to access
              this page
            </Typography>
          ),
          actions: [
            <Button key="login" onClick={this.requestLogin}>
              Log in
            </Button>,
          ],
        },
        notAuthorized: {
          code: 403,
          title: 'You are not allowed to access this page',
          content: this.props.requiresOneOfRoles ? (
            <Typography>
              Only{' '}
              {this.props.requiresOneOfRoles
                .map(c => c.toLowerCase())
                .map(plural)
                .reduce(arrayToSentence())}{' '}
              can access this page
            </Typography>
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
            <Typography>
              This page requires authorization but we were not able to check if
              you are allowed to access it. Please try reloading this page.
            </Typography>
          ),
          pageTitle: 'Error',
          actions: [
            <Button key="reload" onClick={forceReload}>
              Reload
            </Button>,
          ],
        },
      };
      render() {
        const { children, requiresOneOfRoles } = this.props;

        return (
          <Protected requiresOneOfRoles={requiresOneOfRoles}>
            {result => {
              if (typeof children === 'function') {
                return children(result);
              }

              if (result.state === 'authorized') {
                return children;
              }

              const { state } = result;
              const dialogProps = this.dialogPropsForAuthorizationState[state];

              if (dialogProps) {
                return <AuthorizationFailureDialog {...dialogProps} />;
              }

              return <div>Checking your permissions...</div>;
            }}
          </Protected>
        );
      }
    },
  ),
);
