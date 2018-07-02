import { connect } from 'react-redux';
import { AppMenu, StateProps, DispatchProps, OwnProps } from './AppMenu';
import { StoreState } from 'store/types';
import { toggleAuthStatus } from 'store/features/auth/actions';

export const ConnectedAppMenu = connect<
  StateProps,
  DispatchProps,
  OwnProps,
  StoreState
>(
  _state => ({
    user: undefined,
  }),
  { toggleAuthStatus },
)(AppMenu);
