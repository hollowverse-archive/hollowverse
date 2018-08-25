import React from 'react';
import { Switch, Route } from 'react-router';

import { ProtectedWithAuth } from 'components/ProtectedWithAuth/ProtectedWithAuth';
import { UserRole } from 'api/types';
import { AuthorizationState } from 'store/types';

const authorizationStateToElement: Partial<
  Record<AuthorizationState['state'], JSX.Element>
> = {
  authorized: (
    <Switch>
      <Route path="/moderation/users">
        <div>Hello world!</div>
      </Route>
    </Switch>
  ),
  notAuthorized: <div>Not allowed</div>,
  loggedOut: <div>Please log in to access this page</div>,
  error: <div>Error</div>,
};

export const Moderation = () => (
  <ProtectedWithAuth requiresOneOfRoles={['MODERATOR'] as UserRole[]}>
    {({ state }) =>
      authorizationStateToElement[state] || (
        <div>Checking your permissions...</div>
      )
    }
  </ProtectedWithAuth>
);
