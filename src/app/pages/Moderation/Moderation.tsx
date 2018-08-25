import React from 'react';
import { Switch, Route } from 'react-router';
import { ProtectedPage } from 'components/ProtectedPage/ProtectedPage';
import { UserRole } from 'api/types';

export const Moderation = () => (
  <ProtectedPage requiresOneOfRoles={['MODERATOR'] as UserRole[]}>
    <Switch>
      <Route path="/moderation/users">
        <div>Hello world!</div>
      </Route>
    </Switch>
  </ProtectedPage>
);
