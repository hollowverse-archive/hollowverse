import React from 'react';

import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import Chip from '@material-ui/core/Chip';
import Avatar from '@material-ui/core/Avatar';
import RemovedIcon from '@material-ui/icons/BlockRounded';
import AllowedIcon from '@material-ui/icons/CheckRounded';
import NotReviewedIcon from '@material-ui/icons/WatchLaterRounded';
import MenuItem from '@material-ui/core/MenuItem';
import MoreIcon from '@material-ui/icons/MoreVert';

import formatDate from 'date-fns/format';

import { Query, Mutation } from 'react-apollo';
import {
  NotablePersonEventsQuery,
  NotablePersonEventsQueryVariables,
  NotablePersonEventReviewStatus,
  ChangeNotablePersonEventReviewStatusMutation,
  ChangeNotablePersonEventReviewStatusMutationVariables,
} from 'api/types';
import eventsQuery from '!!graphql-tag/loader!./NotablePersonEventsQuery.graphql';
import changeReviewStatusMutation from '!!graphql-tag/loader!./ChangeNotablePersonEventReviewStatusMutation.graphql';

import { prettifyUrl } from 'helpers/prettifyUrl';
import { callAll } from 'helpers/callAll';

import { Quote } from 'components/Quote/Quote';
import { UncontrolledMenu } from 'components/UncontrolledMenu/UncontrolledMenu';
import { CircularProgress } from '@material-ui/core';

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

const Time = ({
  dateString,
  format = 'MMMM D, YYYY',
}: {
  dateString?: string | null;
  format?: string;
}) => {
  if (!dateString) {
    return null;
  }

  const date = new Date(dateString);

  return <time dateTime={date.toISOString()}>{formatDate(date, format)}</time>;
};

// tslint:disable max-func-body-length
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
                postedAt,
                sourceUrl,
                reviewStatus,
              },
            }) => {
              return (
                <Mutation<
                  ChangeNotablePersonEventReviewStatusMutation,
                  ChangeNotablePersonEventReviewStatusMutationVariables
                >
                  mutation={changeReviewStatusMutation}
                  refetchQueries={[{ query: eventsQuery }]}
                  awaitRefetchQueries
                  key={id}
                >
                  {(changeReviewStatus, { loading: isMutationLoading }) => (
                    <Card>
                      <CardHeader
                        title={notablePerson.name}
                        subheader={
                          <small>
                            <a href={sourceUrl}>{prettifyUrl(sourceUrl)}</a>
                          </small>
                        }
                        avatar={
                          notablePerson.mainPhoto ? (
                            <Avatar src={notablePerson.mainPhoto.url} />
                          ) : (
                            undefined
                          )
                        }
                        action={
                          <>
                            <Chip
                              avatar={
                                isMutationLoading ? (
                                  <CircularProgress
                                    style={{ marginLeft: 5 }}
                                    size={20}
                                  />
                                ) : (
                                  iconByReviewStatus[reviewStatus]
                                )
                              }
                              label={
                                isMutationLoading
                                  ? 'Updating...'
                                  : labelByReviewStatus[reviewStatus]
                              }
                              variant="outlined"
                            />
                            <UncontrolledMenu
                              id={`quote-${id}-menu`}
                              renderButton={buttonProps => (
                                <IconButton
                                  aria-label="Open menu"
                                  {...buttonProps}
                                >
                                  <MoreIcon />
                                </IconButton>
                              )}
                            >
                              {menuItemProps => {
                                return (
                                  <>
                                    {reviewStatus !== 'ALLOWED' ? (
                                      <MenuItem
                                        {...menuItemProps}
                                        onClick={callAll(
                                          menuItemProps.onClick,
                                          () => {
                                            changeReviewStatus({
                                              variables: {
                                                input: {
                                                  eventId: id,
                                                  newValue: 'ALLOWED' as NotablePersonEventReviewStatus,
                                                },
                                              },
                                            });
                                          },
                                        )}
                                      >
                                        Allow
                                      </MenuItem>
                                    ) : null}
                                    {reviewStatus !== 'REMOVED' ? (
                                      <MenuItem
                                        {...menuItemProps}
                                        onClick={callAll(
                                          menuItemProps.onClick,
                                          () => {
                                            changeReviewStatus({
                                              variables: {
                                                input: {
                                                  eventId: id,
                                                  newValue: 'REMOVED' as NotablePersonEventReviewStatus,
                                                },
                                              },
                                            });
                                          },
                                        )}
                                      >
                                        Remove
                                      </MenuItem>
                                    ) : null}
                                  </>
                                );
                              }}
                            </UncontrolledMenu>
                          </>
                        }
                      />
                      <CardContent>
                        <Quote size="large">
                          <Typography paragraph>{quote}</Typography>
                        </Quote>
                        <Table>
                          <TableBody>
                            <TableRow>
                              <TableCell>Submitted by</TableCell>
                              <TableCell>
                                <div
                                  style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                  }}
                                >
                                  {submittedBy.photoUrl ? (
                                    <Avatar
                                      style={{
                                        display: 'inline-flex',
                                        marginRight: 5,
                                      }}
                                      src={submittedBy.photoUrl}
                                    />
                                  ) : (
                                    undefined
                                  )}
                                  {submittedBy.name}
                                </div>
                              </TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell>Submitted on</TableCell>
                              <TableCell>
                                <Time dateString={postedAt} />
                              </TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell>Event happened on</TableCell>
                              <TableCell>
                                {happenedOn ? (
                                  <Time dateString={happenedOn} />
                                ) : (
                                  '(unspecified)'
                                )}
                              </TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </CardContent>
                      <CardActions />
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
