import React from 'react';
import { Query } from 'react-apollo';
import { Switch, Redirect, Route, RouteComponentProps } from 'react-router';
import Typography from '@material-ui/core/Typography';
import Tab from '@material-ui/core/Tab';
import {
  NotablePersonEventsQuery,
  NotablePersonEventsQueryVariables,
  NotablePersonEventReviewStatus,
} from 'api/types';
import eventsQuery from '!!graphql-tag/loader!./NotablePersonEventsQuery.graphql';
import { LocationAwareTabs } from 'components/LocationAwareTabs/LocationAwareTabs';
import { EventCard } from './EventCard';
import {
  InfiniteConnection,
  RenderEdgeProps,
} from 'components/InfiniteConnection/InfiniteConnection';

const renderEdge = ({
  edge,
  variables,
}: RenderEdgeProps<
  NotablePersonEventsQuery,
  'notablePeopleEvents',
  NotablePersonEventsQueryVariables
>) => <EventCard key={edge.node.id} variables={variables} {...edge} />;

export const Events = ({ location }: RouteComponentProps<unknown>) => (
  <>
    <Typography align="center" variant="title" component="h1">
      Events
    </Typography>
    <LocationAwareTabs location={location} indicatorColor="primary" centered>
      <Tab
        value="/moderation/events/pending"
        label={<Typography>Pending Review</Typography>}
      />
      <Tab
        value="/moderation/events/all"
        label={<Typography>All</Typography>}
      />
    </LocationAwareTabs>
    <Switch>
      <Route path="/moderation/events/:filter">
        {({
          match: {
            params: { filter },
          },
        }) => (
          <Query<NotablePersonEventsQuery, NotablePersonEventsQueryVariables>
            key={filter}
            query={eventsQuery}
            fetchPolicy="network-only"
            variables={{
              where: {
                reviewStatus:
                  filter === 'pending'
                    ? NotablePersonEventReviewStatus.NOT_REVIEWED
                    : undefined,
              },
            }}
          >
            {queryResult => {
              return (
                <InfiniteConnection
                  {...queryResult}
                  connectionKey="notablePeopleEvents"
                  placeholder={<div>Loading...</div>}
                  renderEdge={renderEdge}
                />
              );
            }}
          </Query>
        )}
      </Route>
      <Redirect to="/moderation/events/pending" />
    </Switch>
  </>
);
