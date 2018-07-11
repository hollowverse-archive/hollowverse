import React from 'react';
import Modal, { AriaModalProps } from 'react-aria-modal';

import { Paper } from 'components/Paper/Paper';

import classes from './Dialog.module.scss';

type Props = AriaModalProps & { children: React.ReactNode };

export const Dialog = ({ children, ...props }: Props) => (
  <Modal underlayClickExits {...props}>
    <div className={classes.root}>
      <Paper className={classes.child}>{children}</Paper>
    </div>
  </Modal>
);
