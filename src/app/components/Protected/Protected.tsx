import React from 'react';
import { connect } from 'react-redux';

import { StoreState, AuthorizationState } from 'store/types';
import { UserRole } from 'api/types';
import { getAuthorizationState } from 'store/features/auth/reducer';

type StateProps = {
  authorizationState: AuthorizationState;
};

export type OwnProps = {
  /**
   * Users who have any of these roles will be allowed
   */
  authorizedRoles?: UserRole[];
  /**
   * Unless `children` is a function, its value will be rendered if
   * the user is authenticated and has any of the required roles passed
   * via `authorizedRoles`. Otherwise, the component will render nothing.
   *
   * If `children` is function, it will be passed an object
   * which contains information about whether the user is authorized and
   * it is up to that function to decide what to render or if
   * it will render anything at all.
   */
  children: React.ReactNode | ((result: AuthorizationState) => React.ReactNode);
};

type Props = OwnProps & StateProps;

/**
 * A component that conditionally renders its `children` based on
 * whether the current viewer is logged in and if it has sufficient
 * permissions to view the content.
 *
 * If more control is needed over the rendered `children`, a function can
 * be used instead which is passed an `AuthorizationState` object that
 * contains information about the authentication/authorization state of
 * the viewer.
 */
export const Protected = connect(
  (state: StoreState, { authorizedRoles }: OwnProps) => ({
    authorizationState: getAuthorizationState(state)(authorizedRoles),
  }),
)(
  class extends React.PureComponent<Props> {
    render() {
      const { children, authorizationState } = this.props;

      if (typeof children === 'function') {
        return children(authorizationState);
      }

      return authorizationState.state === 'authorized' ? children : null;
    }
  },
);
