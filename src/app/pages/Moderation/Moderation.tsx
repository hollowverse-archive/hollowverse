import React from 'react';
import { Switch, Route, Redirect } from 'react-router';
import { connect } from 'react-redux';
// import { ProtectedPage } from 'components/ProtectedPage/ProtectedPage';
// import { UserRole } from 'api/types';
import Typography from '@material-ui/core/Typography';
import { List, ListItem, Avatar, ListItemText } from '@material-ui/core';
import Tab from '@material-ui/core/Tab';
import { StoreState } from 'store/types';
import { LocationAwareTabs } from 'components/LocationAwareTabs/LocationAwareTabs';

import gql from 'graphql-tag';

import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { createHttpLink } from 'apollo-link-http';

import { ApolloProvider, Query } from 'react-apollo';
import { getAccessToken } from 'store/features/auth/reducer';
import IntersectionObserver from 'react-intersection-observer';

export const Moderation = connect((state: StoreState) => ({
  accessToken: getAccessToken(state),
}))(({ accessToken }) => (
  // <ProtectedPage authorizedRoles={['MODERATOR'] as UserRole[]}>
  <div>
    <ApolloProvider
      client={
        new ApolloClient({
          link: createHttpLink({
            uri: __API_ENDPOINT__,
            headers: {
              Authorization: accessToken ? `Bearer ${accessToken}` : '',
            },
            useGETForQueries: accessToken === null,
          }),
          cache: new InMemoryCache(),
          connectToDevTools: true,
        })
      }
    >
      <Switch>
        <Route path="/moderation/users">
          <>
            <Typography variant="title" component="h1">
              User Management
            </Typography>
            <LocationAwareTabs
              indicatorColor="primary"
              value="/moderation/users/all"
              centered
            >
              <Tab value="/moderation/users/all" label="All" />
              <Tab value="/moderation/users/banned" label="Banned" />
            </LocationAwareTabs>
            <Switch>
              <Route path="/moderation/users/all">
                {() => (
                  <Query
                    fetchPolicy="cache-and-network"
                    query={gql`
                      query UsersQuery($after: ID) {
                        users(first: 10, after: $after) {
                          edges {
                            node {
                              id
                              photoUrl
                              name
                              email
                            }
                          }
                          pageInfo {
                            hasNextPage
                            endCursor
                          }
                        }
                      }
                    `}
                  >
                    {({ data, fetchMore }) => (
                      <List>
                        {data &&
                          data.users &&
                          data.users.edges.map(
                            ({ node: { id, photoUrl, name, email } }: any) => (
                              <ListItem key={id}>
                                <Avatar src={photoUrl} />
                                <ListItemText
                                  primary={name}
                                  secondary={email}
                                />
                              </ListItem>
                            ),
                          )}
                        {data &&
                          data.users &&
                          data.users.pageInfo &&
                          data.users.pageInfo.hasNextPage && (
                            <IntersectionObserver
                              onChange={inView => {
                                if (!inView) {
                                  return;
                                }

                                console.log({ inView }, 'fetching...');

                                fetchMore({
                                  variables: {
                                    after: data.users.pageInfo.endCursor,
                                  },
                                  updateQuery(
                                    previousResult,
                                    { fetchMoreResult },
                                  ) {
                                    const newEdges =
                                      fetchMoreResult.users.edges;
                                    const { pageInfo } = fetchMoreResult.users;

                                    return newEdges.length
                                      ? {
                                          // Put the new users at the end of the list and update `pageInfo`
                                          // so we have the new `endCursor` and `hasNextPage` values
                                          users: {
                                            ...previousResult.users,
                                            edges: [
                                              ...previousResult.users.edges,
                                              ...newEdges,
                                            ],
                                            pageInfo,
                                          },
                                        }
                                      : previousResult;
                                  },
                                });
                              }}
                            />
                          )}
                      </List>
                    )}
                  </Query>
                )}
              </Route>
              <Route path="/moderation/users/banned">
                {() => <div>Banned users</div>}
              </Route>
              <Route>
                <Redirect to="/moderation/users/all" />
              </Route>
            </Switch>
          </>
        </Route>
      </Switch>
    </ApolloProvider>
  </div>
  // </ProtectedPage>
));
