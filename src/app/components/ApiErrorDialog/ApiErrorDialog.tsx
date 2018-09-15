import React from 'react';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';

import { UncontrolledDialog } from 'components/UncontrolledDialog/UncontrolledDialog';
import { ApiError } from 'api/helpers';

type Props = {
  id: string;
  title: string;
  errors?: ApiError[];
};

export const ApiErrorDialog = ({ title, id, errors }: Props) => {
  return (
    <UncontrolledDialog role="alertdialog" aria-labelledby={id} open>
      {({ close }) => (
        <>
          <DialogTitle id={id}>{title}</DialogTitle>
          {errors !== undefined && errors.length > 0 ? (
            <DialogContent>
              <DialogContentText>
                {errors.map(({ message }) => (
                  <span key={message}>{message}</span>
                ))}
              </DialogContentText>
            </DialogContent>
          ) : null}
          <DialogActions>
            <Button onClick={close}>Dismiss</Button>
          </DialogActions>
        </>
      )}
    </UncontrolledDialog>
  );
};
