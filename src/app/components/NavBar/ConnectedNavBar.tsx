import { connect } from 'react-redux';
import { NavBar, StateProps, DispatchProps, OwnProps } from './NavBar';
import {
  searchQueryChanged,
  setShouldFocusSearch,
  goToSearch,
} from 'store/features/search/actions';
import { StoreState } from 'store/types';
import {
  getSearchInputValue,
  shouldFocusSearch,
  isSearchInProgress,
} from 'store/features/search/selectors';
import { isSearchPage, isHomePage } from 'store/features/url/selectors';

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
    isSearchPage: isSearchPage(state),
    isHomePage: isHomePage(state),
  }),
  {
    goToSearch,
    searchQueryChanged,
    setShouldFocusSearch,
  },
)(NavBar);
