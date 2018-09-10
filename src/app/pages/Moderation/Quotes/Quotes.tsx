import React from 'react';

import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Chip from '@material-ui/core/Chip';
import RemovedIcon from '@material-ui/icons/BlockOutlined';
import AllowedIcon from '@material-ui/icons/CheckOutlined';
import NotReviewedIcon from '@material-ui/icons/WatchLaterOutlined';

import formatDate from 'date-fns/format';

import { Query } from 'react-apollo';
import {
  NotablePersonEventsQuery,
  NotablePersonEventsQueryVariables,
  NotablePersonEventReviewStatus,
} from 'api/types';
import notablePersonEventsQuery from '!!graphql-tag/loader!./NotablePersonEventsQuery.graphql';

import { prettifyUrl } from 'helpers/prettifyUrl';

const labelByReviewStatus: Record<NotablePersonEventReviewStatus, string> = {
  ALLOWED: 'Allowed',
  REMOVED: 'Removed',
  NOT_REVIEWED: 'Not reviewed',
};

const iconByReviewStatus: Record<
  NotablePersonEventReviewStatus,
  JSX.Element
> = {
  ALLOWED: <AllowedIcon />,
  REMOVED: <RemovedIcon />,
  NOT_REVIEWED: <NotReviewedIcon />,
};

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
            ({
              node: {
                id,
                quote,
                submittedBy,
                notablePerson,
                happenedOn,
                sourceUrl,
                reviewStatus,
              },
            }) => {
              const date = happenedOn ? new Date(happenedOn) : undefined;

              return (
                <Card key={id}>
                  <CardContent>
                    <Typography component="blockquote" variant="subheading">
                      {notablePerson.name}
                    </Typography>
                    <Typography component="blockquote" variant="headline">
                      {quote}
                    </Typography>
                    <div>Submitted by: {submittedBy.name}</div>
                    <div>Source: {prettifyUrl(sourceUrl)}</div>
                    <div>
                      {date !== undefined ? (
                        <time dateTime={date.toISOString()}>
                          {formatDate(date, 'MMMM D, YYYY')}
                        </time>
                      ) : null}
                    </div>
                  </CardContent>
                  <CardActions>
                    <Chip
                      avatar={iconByReviewStatus[reviewStatus]}
                      label={labelByReviewStatus[reviewStatus]}
                    />
                    {reviewStatus !== 'ALLOWED' ? (
                      <Button size="small" color="primary">
                        Allow
                      </Button>
                    ) : null}
                    {reviewStatus !== 'REMOVED' ? (
                      <Button size="small" color="primary">
                        Removed
                      </Button>
                    ) : null}
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
