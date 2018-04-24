import { from as observableFrom, of as observableOf } from 'rxjs';

import { filter, mergeMap, merge, takeUntil, map } from 'rxjs/operators';
import { setResolvedData } from './actions';

import { Action, StoreState, SetResolvedDataPayload } from 'store/types';

import { Epic } from 'redux-observable';

import { promiseToAsyncResult, pendingResult } from 'helpers/asyncResults';
import { isActionOfType } from 'store/helpers';
import { getResolvedDataForKey } from 'store/features/asyncData/selectors';
import { EpicDependencies } from 'store/createConfiguredStore';

export const dataResolverEpic: Epic<Action, StoreState, EpicDependencies> = (
  action$,
  state$,
  { getResponseForDataRequest },
) => {
  return action$.ofType<Action<'REQUEST_DATA'>>('REQUEST_DATA').pipe(
    mergeMap(action => {
      const {
        key,
        forPage,
        requestId,
        keepStaleData,
        optimisticResponse,
      } = action.payload;

      const previousResult = getResolvedDataForKey(state$.value)(key);

      let data: SetResolvedDataPayload['data'];

      if (optimisticResponse !== undefined) {
        data = {
          value: optimisticResponse,
          state: 'optimistic',
          requestId,
        };
      } else if (
        keepStaleData &&
        (previousResult.state === 'success' || previousResult.state === 'stale')
      ) {
        data = {
          ...previousResult,
          state: 'stale',
          requestId,
        };
      } else {
        data = {
          ...pendingResult,
          requestId,
        };
      }

      return observableOf(
        setResolvedData({
          key,
          forPage,
          data,
        }),
      ).pipe(
        merge(
          observableFrom(
            promiseToAsyncResult(getResponseForDataRequest(action.payload)),
          ).pipe(
            map(completionData =>
              setResolvedData({
                key,
                forPage,
                data: {
                  ...completionData,
                  requestId,
                },
              }),
            ),
          ),
        ),
        takeUntil(
          action$.pipe(
            filter(
              newAction =>
                isActionOfType(newAction, 'REQUEST_DATA') &&
                newAction.payload.key === key,
            ),
          ),
        ),
      );
    }),
  );
};
