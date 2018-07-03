import { connect } from 'react-redux';
import { AppMenu, StateProps, DispatchProps, OwnProps } from './AppMenu';
import { StoreState } from 'store/types';
import { requestLogin, requestLogout } from 'store/features/auth/actions';
import { getResolvedDataForKey } from 'store/features/asyncData/selectors';

export const ConnectedAppMenu = connect<
  StateProps,
  DispatchProps,
  OwnProps,
  StoreState
>(
  state => ({
    viewerQueryResult: getResolvedDataForKey(state)('viewer'),
  }),
  { requestLogin, requestLogout },
)(AppMenu);
