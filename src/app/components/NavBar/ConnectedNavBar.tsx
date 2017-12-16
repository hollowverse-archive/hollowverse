import { connect } from 'react-redux';
import { NavBar } from './NavBar';
import { requestSearchResults } from 'store/features/search/actions';
import { StoreState } from 'store/types';
import { getSearchQuery } from 'store/features/search/reducer';

export const ConnectedNavBar = connect(
  (state: StoreState) => ({ searchQuery: getSearchQuery(state) }),
  {
    requestSearchResults,
  },
)(NavBar);
