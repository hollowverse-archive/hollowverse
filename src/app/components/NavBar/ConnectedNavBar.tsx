import { connect } from 'react-redux';
import { NavBar } from './NavBar';
import { requestSearchResults } from 'store/features/search/actions';
import { StoreState } from 'store/types';
import {
  getSearchQuery,
  isSearchInProgress,
} from 'store/features/search/selectors';

export const ConnectedNavBar = connect(
  (state: StoreState) => ({
    searchQuery: getSearchQuery(state),
    lastSearchMatch: state.lastSearchMatch,
    isSearchInProgress: isSearchInProgress(state),
  }),
  {
    requestSearchResults,
  },
)(NavBar);
