import { createSelector } from 'reselect';
import { StoreState } from 'store/types';

export const getAllResolvedData = (state: StoreState) => state.resolvedData;

export const getResolvedDataForKey = createSelector(
  getAllResolvedData,
  data => <K extends keyof typeof data>(key: K) => data[key],
);

export const shouldShowGlobalProgress = createSelector(
  getAllResolvedData,
  ({ notablePersonQuery, searchResults }) => {
    return [notablePersonQuery, searchResults].some(
      ({ state }) => state !== 'success' && state !== 'error',
    );
  },
);
