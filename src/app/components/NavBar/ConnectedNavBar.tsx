import { connect } from 'react-redux';
import { NavBar } from './NavBar';
import { requestSearchResults } from 'store/features/search/actions';
import { StoreState } from 'store/types';

export const ConnectedNavBar = connect(
  ({ searchQuery }: StoreState) => ({ searchQuery }),
  {
    requestSearchResults,
  },
)(NavBar);
