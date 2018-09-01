import React from 'react';
import { Query, QueryResult } from 'react-apollo';
import { Switch, Route, Redirect } from 'react-router';
import IntersectionObserver from 'react-intersection-observer';
import random from 'lodash/random';
import times from 'lodash/times';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';
import Avatar from '@material-ui/core/Avatar';
import Tab from '@material-ui/core/Tab';
import MoreIcon from '@material-ui/icons/MoreVert';
import { withStyles, createStyles, Theme } from '@material-ui/core/styles';

import { UsersQuery, UsersQueryVariables } from 'api/types';

import usersQuery from '!!graphql-tag/loader!./UsersQuery.graphql';

import { createPulseAnimation } from 'helpers/animations';
import { MessageWithIcon } from 'components/MessageWithIcon/MessageWithIcon';
import { LocationAwareTabs } from 'components/LocationAwareTabs/LocationAwareTabs';

const LoadingListPlaceholder = withStyles((theme: Theme) => {
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
})(({ classes }) => (
  <List aria-hidden className={classes.root}>
    {times(random(2, 5), i => (
      <ListItem key={i}>
        <Avatar className={classes.photo} />
        <ListItemText
          aria-hidden
          primary={
            <span className={classes.text}>{'#'.repeat(random(10, 25))}</span>
          }
          secondary={
            <span className={classes.text}>{'#'.repeat(random(10, 25))}</span>
          }
        />
      </ListItem>
    ))}
  </List>
));

const renderUserList = ({
  data,
  fetchMore,
  loading,
}: QueryResult<UsersQuery, UsersQueryVariables>) => {
  if (loading) {
    return <LoadingListPlaceholder />;
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

  return (
    <List>
      {edges.map(({ node: { id, photoUrl, name, email } }) => (
        <ListItem key={id}>
          <Avatar src={photoUrl || undefined} />
          <ListItemText primary={name} secondary={email} />
          <ListItemSecondaryAction>
            <IconButton>
              <MoreIcon />
            </IconButton>
          </ListItemSecondaryAction>
        </ListItem>
      ))}
      {hasNextPage ? (
        <>
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

                  const { edges: newEdges } = fetchMoreResult.users;
                  const { pageInfo } = fetchMoreResult.users;

                  return {
                    ...previousResult,
                    // Put the new users at the end of the list and update `pageInfo`
                    // so we have the new `endCursor` and `hasNextPage` values
                    users: {
                      ...previousResult.users,
                      edges: [...previousResult.users.edges, ...newEdges],
                      pageInfo,
                    },
                  };
                },
              });
            }}
          >
            {inView => (inView ? <LoadingListPlaceholder /> : null)}
          </IntersectionObserver>
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
