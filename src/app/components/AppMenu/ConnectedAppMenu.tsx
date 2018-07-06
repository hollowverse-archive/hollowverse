import { connect } from 'react-redux';
import { AppMenu, StateProps, DispatchProps, OwnProps } from './AppMenu';
import { StoreState } from 'store/types';
import { isNightModeEnabled } from 'store/features/theme/reducer';
import { toggleNightMode } from 'store/features/theme/actions';

export const ConnectedAppMenu = connect<
  StateProps,
  DispatchProps,
  OwnProps,
  StoreState
>(
  state => ({
    isNightModeEnabled: isNightModeEnabled(state),
  }),
  { toggleNightMode },
)(AppMenu);
