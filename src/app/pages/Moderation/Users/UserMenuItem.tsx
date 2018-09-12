import React from 'react';
import { Mutation } from 'react-apollo';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import MenuItem from '@material-ui/core/MenuItem';
import IconButton from '@material-ui/core/IconButton';
import Avatar from '@material-ui/core/Avatar';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
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
import { UncontrolledDialog } from 'components/UncontrolledDialog/UncontrolledDialog';
import {
  UncontrolledSnackbar,
  UncontrolledSnackbarChildrenProps,
} from 'components/UncontrolledSnackbar/UncontrolledSnackbar';

const renderUserMenuItemButton: (
  props: UncontrolledMenuButtonProps,
) => JSX.Element = props => (
  <IconButton {...props}>
    <MoreIcon />
  </IconButton>
);

const renderDismissButton = ({ close }: UncontrolledSnackbarChildrenProps) => (
  <Button color="secondary" size="small" onClick={close}>
    Dismiss
  </Button>
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
      <ListItem key={id}>
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
                {data &&
                data.changeUserIsBannedStatus.result.state === 'ERROR' ? (
                  <UncontrolledDialog
                    role="alertdialog"
                    aria-labelledby="change-user-ban-status-failure-dialog-title"
                    open
                  >
                    {({ close }) => (
                      <>
                        <DialogTitle id="change-user-ban-status-failure-dialog-title">
                          Failed to change ban status of user
                        </DialogTitle>
                        <DialogContent>
                          <DialogContentText>
                            {(data.changeUserIsBannedStatus
                              .result as any).errors.map(({ message }: any) => (
                              <span key={message}>{message}</span>
                            ))}
                          </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                          <Button onClick={close}>Dismiss</Button>
                        </DialogActions>
                      </>
                    )}
                  </UncontrolledDialog>
                ) : null}
                {data &&
                data.changeUserIsBannedStatus.result.state === 'SUCCESS' ? (
                  <UncontrolledSnackbar
                    open
                    autoHideDuration={2000}
                    message={<span>Ban status changed successfully</span>}
                    renderAction={renderDismissButton}
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
