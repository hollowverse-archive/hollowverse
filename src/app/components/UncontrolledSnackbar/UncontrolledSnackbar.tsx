import React from 'react';
import Snackbar, { SnackbarProps } from '@material-ui/core/Snackbar';
import { Omit } from 'typings/typeHelpers';

export type UncontrolledSnackbarChildrenProps = {
  close(): void;
};

type Props = Omit<SnackbarProps, 'action'> & {
  renderAction(
    props: UncontrolledSnackbarChildrenProps,
  ): SnackbarProps['action'];
};

type State = {
  isOpen: boolean;
};

export const UncontrolledSnackbar = class extends React.PureComponent<
  Props,
  State
> {
  state: State = {
    isOpen: this.props.open,
  };

  handleClose = () => {
    this.setState({ isOpen: false });
  };

  render() {
    const { renderAction, ...rest } = this.props;

    return (
      <Snackbar
        {...rest}
        open={this.state.isOpen}
        onClose={this.handleClose}
        action={renderAction({ close: this.handleClose })}
      />
    );
  }
};
