import React from 'react';
import { Switch, Route } from 'react-router';
import { connect } from 'react-redux';
import { ApolloProvider } from 'react-apollo';
import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { createHttpLink } from 'apollo-link-http';
import { createSelector } from 'reselect';

import {
  getApiAuthHeaders,
  shouldUseHttpGetForApiRequests,
} from 'store/features/auth/reducer';
import { StoreState } from 'store/types';
// import { UserRole } from 'api/types';

// import { ProtectedPage } from 'components/ProtectedPage/ProtectedPage';

import { Users } from './Users/Users';

// @TODO: Because Apollo is not (yet) used in any user-facing UI, we'll keep this
// selector and all Apollo library imports in this file, to avoid increasing bundle
// size significantly. We should later move this to src/store after we migrate the
// whole app to use Apollo client.
const getApolloClient = createSelector(
  getApiAuthHeaders,
  shouldUseHttpGetForApiRequests,
  (authHeaders, useHttpGet) =>
    new ApolloClient({
      link: createHttpLink({
        uri: __API_ENDPOINT__,
        headers: {
          ...authHeaders,
        },
        useGETForQueries: useHttpGet,
      }),
      cache: new InMemoryCache(),
      connectToDevTools: true,
    }),
);

export const Moderation = connect((state: StoreState) => ({
  client: getApolloClient(state),
}))(({ client }) => (
  // <ProtectedPage authorizedRoles={['MODERATOR'] as UserRole[]}>
  <div>
    <ApolloProvider client={client}>
      <Switch>
        <Route path="/moderation/users" component={Users} />
      </Switch>
    </ApolloProvider>
  </div>
  // </ProtectedPage>
));
