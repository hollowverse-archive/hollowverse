import React from 'react';
import { Switch, Route } from 'react-router';
import { connect } from 'react-redux';
import { ApolloProvider } from 'react-apollo';
import { ApolloClient } from 'apollo-client';
import {
  InMemoryCache,
  IntrospectionFragmentMatcher,
} from 'apollo-cache-inmemory';
import { createHttpLink } from 'apollo-link-http';
import { createSelector } from 'reselect';
import introspectionQueryResultData from 'api/fragmentTypes.json';

const fragmentMatcher = new IntrospectionFragmentMatcher({
  introspectionQueryResultData,
});

import {
  getApiAuthHeaders,
  shouldUseHttpGetForApiRequests,
} from 'store/features/auth/reducer';
import { StoreState } from 'store/types';
import { UserRole } from 'api/types';

import { ProtectedPage } from 'components/ProtectedPage/ProtectedPage';

import { Users } from './Users/Users';
import { Quotes } from './Quotes/Quotes';

// tslint:disable-next-line no-suspicious-comment
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
      cache: new InMemoryCache({ fragmentMatcher }),
      connectToDevTools: true,
    }),
);

export const Moderation = connect((state: StoreState) => ({
  client: getApolloClient(state),
}))(({ client }) => (
  <ProtectedPage authorizedRoles={[UserRole.MODERATOR]}>
    <div>
      <ApolloProvider client={client}>
        <Switch>
          <Route path="/moderation/users" component={Users} />
          <Route path="/moderation/events" component={Quotes} />
        </Switch>
      </ApolloProvider>
    </div>
  </ProtectedPage>
));
