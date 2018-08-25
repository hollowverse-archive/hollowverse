import { connect } from 'react-redux';
import { AppMenu, StateProps, DispatchProps, OwnProps } from './AppMenu';
import { StoreState } from 'store/types';
import { requestLogin, requestLogout } from 'store/features/auth/actions';
import { getAuthenticationState } from 'store/features/auth/reducer';
import { isNightModeEnabled } from 'store/features/theme/reducer';
import { toggleNightMode } from 'store/features/theme/actions';

export const ConnectedAppMenu = connect<
  StateProps,
  DispatchProps,
  OwnProps,
  StoreState
>(
  state => ({
    authState: getAuthenticationState(state),
    isNightModeEnabled: isNightModeEnabled(state),
  }),
  { requestLogin, requestLogout, toggleNightMode },
)(AppMenu);
