import React from 'react';

import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
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

          return edges.map(
            ({ node: { id, quote, submittedBy, notablePerson } }) => {
              return (
                <Card key={id}>
                  <CardContent>
                    <Typography component="blockquote" variant="subheading">
                      {notablePerson.name}
                    </Typography>
                    <Typography component="blockquote" variant="headline">
                      {quote}
                    </Typography>
                    Submitted by: {submittedBy.name}
                  </CardContent>
                  <CardActions>
                    <Button size="small" color="primary">
                      Allow
                    </Button>
                    <Button size="small" color="primary">
                      Remove
                    </Button>
                  </CardActions>
                </Card>
              );
            },
          );
        }

        return null;
      }}
    </Query>
  </>
);
