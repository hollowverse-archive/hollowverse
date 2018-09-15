import React from 'react';
import Dialog, { DialogProps } from '@material-ui/core/Dialog';
import { Omit } from 'typings/typeHelpers';

type UncontrolledDialogChildrenProps = {
  close(): void;
};

type Props = Omit<DialogProps, 'children'> & {
  children(props: UncontrolledDialogChildrenProps): React.ReactNode;
};

type State = {
  isOpen: boolean;
};

export const UncontrolledDialog = class extends React.PureComponent<
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
    const { children, ...rest } = this.props;

    return (
      <Dialog {...rest} open={this.state.isOpen}>
        {children({ close: this.handleClose })}
      </Dialog>
    );
  }
};
