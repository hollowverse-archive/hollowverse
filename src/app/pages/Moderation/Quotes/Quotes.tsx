import React from 'react';
import { Query } from 'react-apollo';
import Typography from '@material-ui/core/Typography';
import {
  NotablePersonEventsQuery,
  NotablePersonEventsQueryVariables,
} from 'api/types';
import { MessageWithIcon } from 'components/MessageWithIcon/MessageWithIcon';
import eventsQuery from '!!graphql-tag/loader!./NotablePersonEventsQuery.graphql';
import { EventCard } from './EventCard';

export const Quotes = () => (
  <>
    <Typography align="center" variant="title" component="h1">
      Quotes
    </Typography>
    <Query<NotablePersonEventsQuery, NotablePersonEventsQueryVariables>
      query={eventsQuery}
    >
      {({ data, error, loading }) => {
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

          return edges.map(edge => <EventCard {...edge} />);
        }

        return null;
      }}
    </Query>
  </>
);
