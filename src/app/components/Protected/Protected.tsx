import React from 'react';
import { connect } from 'react-redux';

import { StoreState, AuthorizationState } from 'store/types';
import { UserRole } from 'api/types';
import { getAuthorizationState } from 'store/features/auth/reducer';

type StateProps = {
  authorizationState: AuthorizationState;
};

export type OwnProps = {
  requiresOneOfRoles?: UserRole[];
  children: React.ReactNode | ((result: AuthorizationState) => React.ReactNode);
};

type Props = OwnProps & StateProps;

export const Protected = connect(
  (state: StoreState, { requiresOneOfRoles }: OwnProps) => ({
    authorizationState: getAuthorizationState(state)(requiresOneOfRoles),
  }),
)(
  class extends React.Component<Props> {
    render() {
      const { children, authorizationState } = this.props;

      if (typeof children === 'function') {
        return children(authorizationState);
      }

      return authorizationState.state === 'authorized' ? children : null;
    }
  },
);
