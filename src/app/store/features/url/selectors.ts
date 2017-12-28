import { createSelector } from 'reselect';
import { getResolvedDataForKey } from 'store/features/data/selectors';
import { isSuccessResult } from 'helpers/asyncResults';
import { StoreState } from 'store/types';

export const getRoutingState = (state: StoreState) => state.routing;

export const isSearchPage = createSelector(
  getRoutingState,
  ({ location }) => !!location && location.pathname === '/search',
);

export const isNotablePersonPage = createSelector(
  getRoutingState,
  getResolvedDataForKey,
  ({ location }, getResolvedData) => {
    const data = getResolvedData('notablePersonQuery');
    if (
      location &&
      isSuccessResult(data) &&
      data.value &&
      data.value.notablePerson
    ) {
      return location.pathname === `/${data.value.notablePerson.slug}`;
    }

    return false;
  },
);

export const isHomePage = createSelector(
  getRoutingState,
  ({ location }) => !!location && location.pathname === '/',
);
