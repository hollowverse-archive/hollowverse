import React from 'react';
import Typography from '@material-ui/core/Typography';
import { Query } from 'react-apollo';
import {
  NotablePersonEventsQuery,
  NotablePersonEventsQueryVariables,
} from 'api/types';
import notablePersonEventsQuery from '!!graphql-tag/loader!./NotablePersonEventsQuery.graphql';

export const Quotes = () => (
  <>
    <Typography align="center" variant="title" component="h1">
      Quotes
    </Typography>
    <Query<NotablePersonEventsQuery, NotablePersonEventsQueryVariables>
      query={notablePersonEventsQuery}
    >
      {({ data, error, loading }) => {
        if (loading) {
          return <div>Loading...</div>;
        }

        if (error) {
          return <div>Error</div>;
        }

        if (data && data.notablePeopleEvents.edges.length > 0) {
          const {
            notablePeopleEvents: { edges },
          } = data;

          return edges.map(({ node: { id, quote, submittedBy: { name } } }) => {
            return (
              <div>
                <div key={id}>{quote}</div>
                Submitted by: {name}
              </div>
            );
          });
        }

        return null;
      }}
    </Query>
  </>
);
