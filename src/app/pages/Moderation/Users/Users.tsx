import React from 'react';
import { Query } from 'react-apollo';
import { Switch, Route, Redirect, RouteComponentProps } from 'react-router';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import Tab from '@material-ui/core/Tab';

import { UsersQuery, UsersQueryVariables } from 'api/types';

import usersQuery from '!!graphql-tag/loader!./UsersQuery.graphql';

import { LocationAwareTabs } from 'components/LocationAwareTabs/LocationAwareTabs';

import { UserMenuItem } from './UserMenuItem';
import { LoadingListPlaceholder } from './LoadingListPlaceholder';
import {
  InfiniteLoadingConnection,
  RenderEdgeProps,
} from 'components/InfiniteLoadingConnection/InfiniteLoadingConnection';

const renderEdge = ({
  edge,
  variables,
}: RenderEdgeProps<UsersQuery, 'users', UsersQueryVariables>) => (
  <UserMenuItem key={edge.node.id} {...edge} variables={variables} />
);

export const Users = ({ location }: RouteComponentProps<unknown>) => (
  <>
    <Typography align="center" variant="title" component="h1">
      User Management
    </Typography>
    <LocationAwareTabs location={location} indicatorColor="primary" centered>
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
            key={filter}
            fetchPolicy="network-only"
            query={usersQuery}
            variables={{
              where: {
                isBanned: filter === 'banned' ? true : undefined,
              },
            }}
          >
            {queryResult => {
              return (
                <List>
                  <InfiniteLoadingConnection
                    {...queryResult}
                    connectionKey="users"
                    placeholder={<LoadingListPlaceholder />}
                    renderEdge={renderEdge}
                  />
                </List>
              );
            }}
          </Query>
        )}
      </Route>
      <Redirect to="/moderation/users/all" />
    </Switch>
  </>
);
