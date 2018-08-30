import React from 'react';
import { Switch, Route } from 'react-router';
// import { ProtectedPage } from 'components/ProtectedPage/ProtectedPage';
// import { UserRole } from 'api/types';
import Typography from '@material-ui/core/Typography';
import { List, ListItem, Avatar, ListItemText } from '@material-ui/core';

import gql from 'graphql-tag';

import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { createHttpLink } from 'apollo-link-http';

import { ApolloProvider, Query } from 'react-apollo';

const client = new ApolloClient({
  link: createHttpLink({ uri: __API_ENDPOINT__ }),
  cache: new InMemoryCache(),
});

export const Moderation = () => (
  // <ProtectedPage authorizedRoles={['MODERATOR'] as UserRole[]}>
  <ApolloProvider client={client}>
    <Switch>
      <Route path="/moderation/users">
        <>
          <Typography variant="title" component="h1">
            User Management
          </Typography>
          <Query
            query={gql`
              query UsersQuery {
                users(first: 10) {
                  edges {
                    node {
                      id
                      photoUrl
                      name
                    }
                  }
                }
              }
            `}
          >
            {({ data }) => (
              <List>
                {data &&
                  data.users &&
                  data.users.map(({ id, photoUrl, name }: any) => (
                    <ListItem key={id}>
                      <Avatar src={photoUrl} />
                      <ListItemText primary={name} />
                    </ListItem>
                  ))}
              </List>
            )}
          </Query>
        </>
      </Route>
    </Switch>
  </ApolloProvider>
  // </ProtectedPage>
);
