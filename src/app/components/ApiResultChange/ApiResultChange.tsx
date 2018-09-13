import React from 'react';
import Button from '@material-ui/core/Button';
import {
  UncontrolledSnackbar,
  UncontrolledSnackbarChildrenProps,
} from 'components/UncontrolledSnackbar/UncontrolledSnackbar';
import { ApiErrorDialog } from 'components/ApiErrorDialog/ApiErrorDialog';
import { isErrorApiResult } from 'api/helpers';
import { ResultType } from 'api/types';

const renderDismissButton = ({ close }: UncontrolledSnackbarChildrenProps) => (
  <Button color="secondary" size="small" onClick={close}>
    Dismiss
  </Button>
);

type Props = {
  id: string;
  successMessage: string;
  errorTitle: string;
  result: { state: ResultType };
};

export const ApiResultChange = ({
  id,
  errorTitle,
  successMessage,
  result,
}: Props) => {
  return isErrorApiResult(result) ? (
    <ApiErrorDialog id={id} title={errorTitle} errors={result.errors} />
  ) : (
    <UncontrolledSnackbar
      open
      autoHideDuration={2000}
      message={<span>{successMessage}</span>}
      renderAction={renderDismissButton}
    />
  );
};
