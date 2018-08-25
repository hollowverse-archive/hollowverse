import React from 'react';
import Helmet from 'react-helmet-async';
import { connect } from 'react-redux';
import Button from '@material-ui/core/Button';

import {
  Protected,
  OwnProps as ProtectedProps,
} from 'components/Protected/Protected';
import { Status } from 'components/Status/Status';
import { LinkButton } from 'components/Button/Button';
import { MessageWithIcon } from 'components/MessageWithIcon/MessageWithIcon';
import { requestLogin } from 'store/features/auth/actions';
import { withRouter, RouteComponentProps } from 'react-router';

import { forceReload } from 'helpers/forceReload';

type DispatchProps = {
  requestLogin: typeof requestLogin;
};

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
export const ProtectedPage = withRouter(
  connect(
    undefined,
    {
      requestLogin,
    },
  )(
    class extends React.Component<Props & RouteComponentProps<any>> {
      renderNotAuthorized = () => (
        <>
          <Status code={403} />
          <Helmet>
            <title>Forbidden</title>
          </Helmet>
          <MessageWithIcon
            title="You are not allowed to access this page"
            description="Only moderators can access this page"
            // icon={warningIcon}
          />
        </>
      );

      renderLoggedOut = () => (
        <>
          <Status code={401} />
          <Helmet>
            <title>Login Required</title>
          </Helmet>
          <MessageWithIcon
            title="Login Required"
            description="Please log in to check if you can access this page"
            button={
              <Button onClick={this.handleLoginClick}>
                Log in with Facebook
              </Button>
            }
            // icon={warningIcon}
          />
        </>
      );

      renderError = (error?: Error) => (
        <>
          <Status code={500} error={error} />
          <Helmet>
            <title>Error</title>
          </Helmet>
          <MessageWithIcon
            title="Error checking permissions"
            description="We couldn't check if you are allowed to access this page. Try reloading the page"
            button={
              <LinkButton to={this.props.location} onClick={forceReload}>
                Reload
              </LinkButton>
            }
            // icon={warningIcon}
          />
        </>
      );

      handleLoginClick = () => {
        this.props.requestLogin(undefined);
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

              if (result.state === 'notAuthorized') {
                this.renderNotAuthorized();
              }

              if (result.state === 'loggedOut') {
                this.renderLoggedOut();
              }

              if (result.state === 'error') {
                this.renderError(result.error);
              }

              return <div>Checking your permissions...</div>;
            }}
          </Protected>
        );
      }
    },
  ),
);
