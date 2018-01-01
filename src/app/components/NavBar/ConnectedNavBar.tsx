import { connect } from 'react-redux';
import { NavBar, StateProps, DispatchProps, OwnProps } from './NavBar';
import {
  setShouldFocusSearch,
  goToSearch,
} from 'store/features/search/actions';
import { StoreState } from 'store/types';
import { shouldFocusSearch } from 'store/features/search/selectors';
import { isHomePage } from 'store/features/url/selectors';

export const ConnectedNavBar = connect<
  StateProps,
  DispatchProps,
  OwnProps,
  StoreState
>(
  state => ({
    shouldFocusSearch: shouldFocusSearch(state),
    isHomePage: isHomePage(state),
  }),
  {
    goToSearch,
    setShouldFocusSearch,
  },
)(NavBar);
