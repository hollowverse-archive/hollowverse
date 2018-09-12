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
import MenuItem from '@material-ui/core/MenuItem';
import CircularProgress from '@material-ui/core/CircularProgress';
import RemovedIcon from '@material-ui/icons/BlockOutlined';
import AllowedIcon from '@material-ui/icons/CheckOutlined';
import NotReviewedIcon from '@material-ui/icons/WatchLaterOutlined';
import MoreIcon from '@material-ui/icons/MoreVert';

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
import { FormattedDate } from 'components/FormattedDate/FormattedDate';
import {
  UncontrolledMenu,
  UncontrolledMenuButtonProps,
} from 'components/UncontrolledMenu/UncontrolledMenu';
import { ArrayElement } from 'typings/typeHelpers';

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

const renderMenuButtons = (buttonProps: UncontrolledMenuButtonProps) => (
  <IconButton aria-label="Open menu" {...buttonProps}>
    <MoreIcon />
  </IconButton>
);

// tslint:disable max-func-body-length
const renderEventCard = ({
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
}: ArrayElement<NotablePersonEventsQuery['notablePeopleEvents']['edges']>) => {
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
                  onDelete={
                    reviewStatus !== 'NOT_REVIEWED'
                      ? () => {
                          changeReviewStatus({
                            variables: {
                              input: {
                                eventId: id,
                                newValue: 'NOT_REVIEWED' as NotablePersonEventReviewStatus,
                              },
                            },
                          });
                        }
                      : undefined
                  }
                  avatar={
                    isMutationLoading ? (
                      <CircularProgress style={{ marginLeft: 5 }} size={20} />
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
                  renderButton={renderMenuButtons}
                >
                  {menuItemProps => {
                    return (
                      <>
                        {reviewStatus !== 'ALLOWED' ? (
                          <MenuItem
                            {...menuItemProps}
                            onClick={callAll(menuItemProps.onClick, () => {
                              changeReviewStatus({
                                variables: {
                                  input: {
                                    eventId: id,
                                    newValue: 'ALLOWED' as NotablePersonEventReviewStatus,
                                  },
                                },
                              });
                            })}
                          >
                            Allow
                          </MenuItem>
                        ) : null}
                        {reviewStatus !== 'REMOVED' ? (
                          <MenuItem
                            {...menuItemProps}
                            onClick={callAll(menuItemProps.onClick, () => {
                              changeReviewStatus({
                                variables: {
                                  input: {
                                    eventId: id,
                                    newValue: 'REMOVED' as NotablePersonEventReviewStatus,
                                  },
                                },
                              });
                            })}
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
                    <FormattedDate dateString={postedAt} />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Event happened on</TableCell>
                  <TableCell>
                    {happenedOn ? (
                      <FormattedDate dateString={happenedOn} />
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
};

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

          return edges.map(renderEventCard);
        }

        return null;
      }}
    </Query>
  </>
);
