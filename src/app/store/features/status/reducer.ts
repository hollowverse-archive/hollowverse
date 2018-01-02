import { createReducerForStoreKey, handleAction } from 'store/helpers';
import { StoreState } from 'store/types';

export const statusCodeReducer = createReducerForStoreKey<'statusCode'>(
  {
    SET_STATUS_CODE: handleAction<'statusCode'>('SET_STATUS_CODE'),
  },
  200,
);

export const redirectionUrlReducer = createReducerForStoreKey<'statusCode'>(
  {
    SET_REDIRECTION_URL: handleAction<'statusCode'>('SET_REDIRECTION_URL'),
  },
  200,
);

export const getStatusCode = (state: StoreState) => state.statusCode;
export const getRedirectionUrl = (state: StoreState) => state.redirectionUrl;
