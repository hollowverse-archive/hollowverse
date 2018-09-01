import React from 'react';
import { Switch, Route, Redirect } from 'react-router';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import Tab from '@material-ui/core/Tab';
import { LocationAwareTabs } from 'components/LocationAwareTabs/LocationAwareTabs';

import { Query, QueryResult } from 'react-apollo';
import IntersectionObserver from 'react-intersection-observer';
import { UsersQuery, UsersQueryVariables } from 'api/types';
import usersQuery from '!!graphql-tag/loader!./UsersQuery.graphql';
import {
  withStyles,
  createStyles,
  Theme,
  WithStyles,
} from '@material-ui/core/styles';

import { createPulseAnimation } from 'helpers/animations';
import random from 'lodash/random';
import times from 'lodash/times';

const styles = (theme: Theme) => {
  const pulse = createPulseAnimation(theme);

  return createStyles({
    ...pulse.definition,
    root: {
      color: 'transparent',
      ...pulse.usage,
    },
    photo: pulse.photoProps,
    text: pulse.textProps,
  });
};

const FakeListItem = withStyles(styles)(
  ({
    classes,
    primary = '#'.repeat(random(10, 25)),
    secondary = '#'.repeat(random(10, 25)),
  }: {
    primary?: string;
    secondary?: string;
  } & WithStyles<ReturnType<typeof styles>>) => (
    <ListItem className={classes.root}>
      <Avatar className={classes.photo} />
      <ListItemText
        aria-hidden
        primary={<span className={classes.text}>{primary}</span>}
        secondary={<span className={classes.text}>{secondary}</span>}
      />
    </ListItem>
  ),
);

const FakeListItems = () => (
  <>{times(random(5, 10), i => <FakeListItem key={i} />)}</>
);

const renderUserList = ({
  data,
  fetchMore,
  loading,
}: QueryResult<UsersQuery, UsersQueryVariables>) => {
  if (loading) {
    return (
      <List>
        <FakeListItems />
      </List>
    );
  }

  if (!data || !data.users) {
    return <div>No Users</div>;
  }

  const {
    users: {
      edges,
      pageInfo: { hasNextPage },
    },
  } = data;

  return (
    <List>
      {edges.map(({ node: { id, photoUrl, name, email } }) => (
        <ListItem key={id}>
          <Avatar src={photoUrl || undefined} />
          <ListItemText primary={name} secondary={email} />
        </ListItem>
      ))}
      {hasNextPage ? (
        <>
          <FakeListItems />
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
                          edges: [...previousResult.users.edges, ...newEdges],
                          pageInfo,
                        },
                      }
                    : previousResult;
                },
              });
            }}
          />
        </>
      ) : null}
    </List>
  );
};
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
            {renderUserList}
          </Query>
        )}
      </Route>
      <Route>
        <Redirect to="/moderation/users/all" />
      </Route>
    </Switch>
  </>
);
