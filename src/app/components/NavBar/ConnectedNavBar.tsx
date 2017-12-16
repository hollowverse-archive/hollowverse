import { connect } from 'react-redux';
import { NavBar } from './NavBar';
import { requestSearchResults } from 'store/features/search/actions';

export const ConnectedNavBar = connect(undefined, {
  requestSearchResults,
})(NavBar);
