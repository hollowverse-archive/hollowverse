import React from 'react';
import { Mutation } from 'react-apollo';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import MenuItem from '@material-ui/core/MenuItem';
import IconButton from '@material-ui/core/IconButton';
import Avatar from '@material-ui/core/Avatar';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import CircularProgress from '@material-ui/core/CircularProgress';
import MoreIcon from '@material-ui/icons/MoreVert';
import BlockIcon from '@material-ui/icons/Block';

import {
  UsersQuery,
  UsersQueryVariables,
  ChangeUserIsBannedStatusMutation,
  ChangeUserIsBannedStatusMutationVariables,
} from 'api/types';

import usersQuery from '!!graphql-tag/loader!./UsersQuery.graphql';
import changeUserIsBannedStatusMutation from '!!graphql-tag/loader!./ChangeUserIsBannedStatusMutation.graphql';

import { callAll } from 'helpers/callAll';
import { ArrayElement } from 'typings/typeHelpers';
import {
  UncontrolledMenu,
  UncontrolledMenuButtonProps,
} from 'components/UncontrolledMenu/UncontrolledMenu';
import { ApiResultChange } from 'components/ApiResultChange/ApiResultChange';

const renderUserMenuItemButton = (props: UncontrolledMenuButtonProps) => (
  <IconButton {...props}>
    <MoreIcon />
  </IconButton>
);

type Props = ArrayElement<UsersQuery['users']['edges']> & {
  variables: UsersQueryVariables;
};

export class UserMenuItem extends React.Component<Props> {
  render() {
    const {
      variables,
      node: { id, photoUrl, name, email, isBanned },
    } = this.props;

    return (
      <ListItem>
        <Avatar src={photoUrl || undefined} />
        <ListItemText primary={name} secondary={email} />
        <Mutation<
          ChangeUserIsBannedStatusMutation,
          ChangeUserIsBannedStatusMutationVariables
        >
          mutation={changeUserIsBannedStatusMutation}
          variables={{ input: { newValue: !isBanned, userId: id } }}
          refetchQueries={[{ query: usersQuery, variables }]}
        >
          {(changeUserIsBannedStatus, { loading, data }) => {
            const toggleBanStatus = async () => {
              await changeUserIsBannedStatus();
            };

            return (
              <>
                <ListItemSecondaryAction>
                  <UncontrolledMenu
                    renderButton={renderUserMenuItemButton}
                    anchorOrigin={{
                      horizontal: 'left',
                      vertical: 'center',
                    }}
                    id={`user-action-menu-${id}`}
                  >
                    {props => {
                      return (
                        <MenuItem
                          {...props}
                          onClick={callAll(props.onClick, toggleBanStatus)}
                          disabled={loading}
                        >
                          {isBanned ? null : (
                            <ListItemIcon>
                              {loading ? (
                                <CircularProgress size={24} />
                              ) : (
                                <BlockIcon />
                              )}
                            </ListItemIcon>
                          )}
                          {isBanned ? 'Unban User' : 'Ban User'}
                        </MenuItem>
                      );
                    }}
                  </UncontrolledMenu>
                </ListItemSecondaryAction>
                {data !== undefined ? (
                  <ApiResultChange
                    id="change-user-ban-status-failure-dialog-title"
                    result={data.changeUserIsBannedStatus.result}
                    errorTitle="Failed to change ban status of user"
                    successMessage="User ban status changed successfully"
                  />
                ) : null}
              </>
            );
          }}
        </Mutation>
      </ListItem>
    );
  }
}
