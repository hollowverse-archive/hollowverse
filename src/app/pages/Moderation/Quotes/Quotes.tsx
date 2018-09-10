import React from 'react';

import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Chip from '@material-ui/core/Chip';
import RemovedIcon from '@material-ui/icons/BlockRounded';
import AllowedIcon from '@material-ui/icons/CheckRounded';
import NotReviewedIcon from '@material-ui/icons/WatchLaterRounded';

import formatDate from 'date-fns/format';

import { Query, Mutation } from 'react-apollo';
import {
  NotablePersonEventsQuery,
  NotablePersonEventsQueryVariables,
  NotablePersonEventReviewStatus,
  ChangeNotablePersonEventReviewStatusMutation,
  ChangeNotablePersonEventReviewStatusMutationVariables,
} from 'api/types';
import notablePersonEventsQuery from '!!graphql-tag/loader!./NotablePersonEventsQuery.graphql';
import changeNotablePresonEventReviewStatusMutation from '!!graphql-tag/loader!./ChangeNotablePersonEventReviewStatusMutation.graphql';

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

// tslint:disable max-func-body-length
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
                <Mutation<
                  ChangeNotablePersonEventReviewStatusMutation,
                  ChangeNotablePersonEventReviewStatusMutationVariables
                >
                  mutation={changeNotablePresonEventReviewStatusMutation}
                  refetchQueries={[{ query: notablePersonEventsQuery }]}
                  key={id}
                >
                  {changeReviewStatus => (
                    <Card>
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
                          variant="outlined"
                        />
                        {reviewStatus !== 'ALLOWED' ? (
                          <Button
                            onClick={() => {
                              changeReviewStatus({
                                variables: {
                                  input: {
                                    eventId: id,
                                    newValue: 'ALLOWED' as NotablePersonEventReviewStatus,
                                  },
                                },
                              });
                            }}
                            size="small"
                            color="primary"
                          >
                            Allow
                          </Button>
                        ) : null}
                        {reviewStatus !== 'REMOVED' ? (
                          <Button
                            onClick={() => {
                              changeReviewStatus({
                                variables: {
                                  input: {
                                    eventId: id,
                                    newValue: 'REMOVED' as NotablePersonEventReviewStatus,
                                  },
                                },
                              });
                            }}
                            size="small"
                            color="primary"
                          >
                            Remove
                          </Button>
                        ) : null}
                      </CardActions>
                    </Card>
                  )}
                </Mutation>
              );
            },
          );
        }

        return null;
      }}
    </Query>
  </>
);
