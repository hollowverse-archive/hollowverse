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

import { Mutation } from 'react-apollo';
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
import { ApiResultChange } from 'components/ApiResultChange/ApiResultChange';
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

type Props = ArrayElement<
  NotablePersonEventsQuery['notablePeopleEvents']['edges']
> & { variables: NotablePersonEventsQueryVariables };

export class EventCard extends React.PureComponent<Props> {
  // tslint:disable max-func-body-length
  render() {
    const {
      variables,
      node: {
        id: eventId,
        quote,
        submittedBy,
        notablePerson,
        happenedOn,
        postedAt,
        sourceUrl,
        reviewStatus,
      },
    } = this.props;

    return (
      <Mutation<
        ChangeNotablePersonEventReviewStatusMutation,
        ChangeNotablePersonEventReviewStatusMutationVariables
      >
        mutation={changeReviewStatusMutation}
        refetchQueries={[{ query: eventsQuery, variables }]}
        awaitRefetchQueries
        key={eventId}
      >
        {(changeReviewStatus, { data, loading: isMutationLoading }) => {
          const createSetReviewStatus = (
            newValue: NotablePersonEventReviewStatus,
          ) => async () => {
            await changeReviewStatus({
              variables: {
                input: {
                  eventId,
                  newValue,
                },
              },
            });
          };

          return (
            <>
              {data !== undefined ? (
                <ApiResultChange
                  id="change-event-review-status-failure-dialog-title"
                  result={data.changeNotablePersonEventReviewStatus.result}
                  errorTitle="Failed to change review status of event"
                  successMessage="Event review status changed successfully"
                />
              ) : null}
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
                          !isMutationLoading &&
                          reviewStatus !==
                            NotablePersonEventReviewStatus.NOT_REVIEWED
                            ? createSetReviewStatus(
                                NotablePersonEventReviewStatus.NOT_REVIEWED,
                              )
                            : undefined
                        }
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
                        id={`event-${eventId}-menu`}
                        renderButton={renderMenuButtons}
                      >
                        {menuItemProps => {
                          return (
                            <>
                              {reviewStatus !==
                              NotablePersonEventReviewStatus.ALLOWED ? (
                                <MenuItem
                                  {...menuItemProps}
                                  onClick={callAll(
                                    menuItemProps.onClick,
                                    createSetReviewStatus(
                                      NotablePersonEventReviewStatus.ALLOWED,
                                    ),
                                  )}
                                >
                                  Allow
                                </MenuItem>
                              ) : null}
                              {reviewStatus !==
                              NotablePersonEventReviewStatus.REMOVED ? (
                                <MenuItem
                                  {...menuItemProps}
                                  onClick={callAll(
                                    menuItemProps.onClick,
                                    createSetReviewStatus(
                                      NotablePersonEventReviewStatus.REMOVED,
                                    ),
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
                  <Table padding="dense">
                    <TableBody>
                      <TableRow>
                        <TableCell padding="none">Submitted by</TableCell>
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
                        <TableCell padding="none">Submitted on</TableCell>
                        <TableCell>
                          <FormattedDate dateString={postedAt} />
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell padding="none">Event happened on</TableCell>
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
            </>
          );
        }}
      </Mutation>
    );
  }
}
