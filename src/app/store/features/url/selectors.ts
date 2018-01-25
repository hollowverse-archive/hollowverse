import { createSelector } from 'reselect';
import { StoreState } from 'store/types';

export const getRoutingState = (state: StoreState) => state.routing;

export const isSearchPage = createSelector(
  getRoutingState,
  ({ location }) => !!location && location.pathname === '/search',
);

export const isHomePage = createSelector(
  getRoutingState,
  ({ location }) => !!location && location.pathname === '/',
);
