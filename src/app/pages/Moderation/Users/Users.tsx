import React from 'react';
import { Switch, Route, Redirect } from 'react-router';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import Tab from '@material-ui/core/Tab';
import { LocationAwareTabs } from 'components/LocationAwareTabs/LocationAwareTabs';

import { Query } from 'react-apollo';
import IntersectionObserver from 'react-intersection-observer';
import { UsersQuery, UsersQueryVariables } from 'api/types';
import usersQuery from '!!graphql-tag/loader!./UsersQuery.graphql';

export const Users = () => (
  <>
    <Typography variant="title" component="h1">
      User Management
    </Typography>
    <LocationAwareTabs
      indicatorColor="primary"
      value="/moderation/users/all"
      centered
    >
      <Tab value="/moderation/users/all" label={<Typography>All</Typography>} />
      <Tab
        value="/moderation/users/banned"
        label={<Typography>Banned</Typography>}
      />
    </LocationAwareTabs>
    <Switch>
      <Route path="/moderation/users/:filter">
        {({
          match: {
            params: { filter },
          },
        }) => (
          <Query<UsersQuery, UsersQueryVariables>
            fetchPolicy="cache-and-network"
            query={usersQuery}
            variables={{
              where: {
                isBanned: filter === 'banned' ? true : undefined,
              },
            }}
          >
            {({ data, fetchMore }) => (
              <List>
                {data &&
                  data.users &&
                  data.users.edges.map(
                    ({ node: { id, photoUrl, name, email } }) => (
                      <ListItem key={id}>
                        <Avatar src={photoUrl || undefined} />
                        <ListItemText primary={name} secondary={email} />
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

                        fetchMore({
                          variables: {
                            after: data.users.pageInfo.endCursor,
                          },
                          updateQuery(previousResult, { fetchMoreResult }) {
                            if (!fetchMoreResult) {
                              return previousResult;
                            }

                            const newEdges = fetchMoreResult.users.edges;
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
      <Route>
        <Redirect to="/moderation/users/all" />
      </Route>
    </Switch>
  </>
);
