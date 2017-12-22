import { connect } from 'react-redux';
import { NavBar, StateProps, DispatchProps, OwnProps } from './NavBar';
import {
  requestSearchResults,
  setShouldFocusSearch,
  goToSearch,
} from 'store/features/search/actions';
import { StoreState } from 'store/types';
import {
  getSearchInputValue,
  shouldFocusSearch,
  isSearchInProgress,
} from 'store/features/search/selectors';

export const ConnectedNavBar = connect<
  StateProps,
  DispatchProps,
  OwnProps,
  StoreState
>(
  state => ({
    searchInputValue: getSearchInputValue(state),
    isSearchInProgress: isSearchInProgress(state),
    shouldFocusSearch: shouldFocusSearch(state),
  }),
  {
    goToSearch,
    requestSearchResults,
    setShouldFocusSearch,
  },
)(NavBar);
