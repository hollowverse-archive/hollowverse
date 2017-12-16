import { StoreState } from 'store/types';
import { createSelector } from 'reselect';

const getRoutingState = (state: StoreState) => state.routing;

export const getSearchQuery = createSelector(getRoutingState, routing => {
  if (routing.location) {
    const params = new URLSearchParams(routing.location.search);

    return params.get('query');
  }

  return null;
});
