import { connect } from 'react-redux';
import { SearchBar, StateProps, DispatchProps, OwnProps } from './SearchBar';
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
import { isSearchPage } from 'store/features/url/selectors';

export const ConnectedSearchBar = connect<
  StateProps,
  DispatchProps,
  OwnProps,
  StoreState
>(
  state => ({
    inputValue: getSearchInputValue(state),
    isSearchInProgress: isSearchInProgress(state),
    isFocused: shouldFocusSearch(state) || isSearchPage(state),
    isSearchPage: isSearchPage(state),
  }),
  {
    goToSearch,
    searchQueryChanged,
    setShouldFocusSearch,
  },
)(SearchBar);
