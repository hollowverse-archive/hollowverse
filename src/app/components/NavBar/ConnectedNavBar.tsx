import { connect } from 'react-redux';
import { NavBar, StateProps, DispatchProps, OwnProps } from './NavBar';
import {
  requestSearchResults,
  setSearchIsFocused,
} from 'store/features/search/actions';
import { StoreState } from 'store/types';
import {
  getSearchInputValue,
  isSearchFocused,
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
    isSearchFocused: isSearchFocused(state),
  }),
  {
    requestSearchResults,
    setSearchIsFocused,
  },
)(NavBar);
