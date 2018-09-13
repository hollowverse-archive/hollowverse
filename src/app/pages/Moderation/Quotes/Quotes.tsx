import React from 'react';
import { Query } from 'react-apollo';
import { Switch, Redirect, Route } from 'react-router';
import Typography from '@material-ui/core/Typography';
import Tab from '@material-ui/core/Tab';
import {
  NotablePersonEventsQuery,
  NotablePersonEventsQueryVariables,
  NotablePersonEventReviewStatus,
} from 'api/types';
import { MessageWithIcon } from 'components/MessageWithIcon/MessageWithIcon';
import eventsQuery from '!!graphql-tag/loader!./NotablePersonEventsQuery.graphql';
import { LocationAwareTabs } from 'components/LocationAwareTabs/LocationAwareTabs';
import { EventCard } from './EventCard';

export const Quotes = () => (
  <>
    <Typography align="center" variant="title" component="h1">
      Quotes
    </Typography>
    <LocationAwareTabs
      indicatorColor="primary"
      value="/moderation/events/all"
      centered
    >
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
            query={eventsQuery}
            fetchPolicy="cache-and-network"
            variables={{
              where: {
                reviewStatus:
                  filter === 'pending'
                    ? NotablePersonEventReviewStatus.NOT_REVIEWED
                    : undefined,
              },
            }}
          >
            {({ data, error, loading, variables }) => {
              if (loading) {
                return <div>Loading...</div>;
              }

              if (error) {
                return <MessageWithIcon title="Failed to load" />;
              }

              if (data && data.notablePeopleEvents.edges.length > 0) {
                const {
                  notablePeopleEvents: { edges },
                } = data;

                return edges.map(edge => (
                  <EventCard
                    key={edge.node.id}
                    variables={variables}
                    {...edge}
                  />
                ));
              }

              return null;
            }}
          </Query>
        )}
      </Route>
      <Route>
        <Redirect to="/moderation/events/pending" />
      </Route>
    </Switch>
  </>
);
