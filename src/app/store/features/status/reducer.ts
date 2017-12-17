import { createReducerForStoreKey, handleAction } from 'store/helpers';
import { StoreState } from 'store/types';

export const statusCodeReducer = createReducerForStoreKey<'statusCode'>(
  {
    SET_STATUS_CODE: handleAction('SET_STATUS_CODE'),
  },
  200,
);

export const getStatusCode = (state: StoreState) => state.statusCode;
