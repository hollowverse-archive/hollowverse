import React from 'react';
import { Query } from 'react-apollo';
import { Switch, Route, Redirect } from 'react-router';
import IntersectionObserver from 'react-intersection-observer';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import Tab from '@material-ui/core/Tab';

import { UsersQuery, UsersQueryVariables } from 'api/types';

import usersQuery from '!!graphql-tag/loader!./UsersQuery.graphql';

import { createUpdateRelayConnection } from 'helpers/relay';
import { MessageWithIcon } from 'components/MessageWithIcon/MessageWithIcon';
import { LocationAwareTabs } from 'components/LocationAwareTabs/LocationAwareTabs';

import { UserMenuItem } from './UserMenuItem';
import { LoadingListPlaceholder } from './LoadingListPlaceholder';

const updateUsersQuery = createUpdateRelayConnection<UsersQuery>('users');

export const Users = () => (
  <>
    <Typography align="center" variant="title" component="h1">
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
            {({ data, loading, error, variables, fetchMore }) => {
              if (loading) {
                return <LoadingListPlaceholder />;
              }

              if (error) {
                return <MessageWithIcon title="Failed to load" />;
              }

              if (!data || !data.users || data.users.edges.length === 0) {
                return <MessageWithIcon title="Nothing to show here" />;
              }

              const {
                users: {
                  edges,
                  pageInfo: { hasNextPage },
                },
              } = data;

              const onIntersectionChange = async (inView: boolean) => {
                if (!inView) {
                  return;
                }

                await fetchMore({
                  variables: {
                    after: data.users.pageInfo.endCursor,
                  },
                  updateQuery: updateUsersQuery,
                });
              };

              return (
                <List>
                  {edges.map(edge => (
                    <UserMenuItem
                      key={edge.node.id}
                      {...edge}
                      variables={variables}
                    />
                  ))}
                  {hasNextPage ? (
                    <>
                      <IntersectionObserver onChange={onIntersectionChange}>
                        {inView => (inView ? <LoadingListPlaceholder /> : null)}
                      </IntersectionObserver>
                    </>
                  ) : null}
                </List>
              );
            }}
          </Query>
        )}
      </Route>
      <Route>
        <Redirect to="/moderation/users/all" />
      </Route>
    </Switch>
  </>
);
