import { connect } from 'react-redux';
import { AppMenu, StateProps, DispatchProps, OwnProps } from './AppMenu';
import { StoreState } from 'store/types';
import { requestLogin, requestLogout } from 'store/features/auth/actions';
import { getAuthState } from 'store/features/auth/reducer';

export const ConnectedAppMenu = connect<
  StateProps,
  DispatchProps,
  OwnProps,
  StoreState
>(
  state => ({
    authState: getAuthState(state),
  }),
  { requestLogin, requestLogout },
)(AppMenu);
