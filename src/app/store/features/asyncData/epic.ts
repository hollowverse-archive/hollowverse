import { from as observableFrom, of as observableOf } from 'rxjs';

import { filter, mergeMap, merge, takeUntil, map } from 'rxjs/operators';
import { setResolvedData } from './actions';

import { Action, StoreState, SetResolvedDataPayload } from 'store/types';

import { Epic } from 'redux-observable';

import {
  promiseToAsyncResult,
  pendingResult,
  isSuccessResult,
} from 'helpers/asyncResults';
import { isActionOfType } from 'store/helpers';
import { getResolvedDataForKey } from 'store/features/asyncData/selectors';
import { EpicDependencies } from 'store/createConfiguredStore';

export const dataResolverEpic: Epic<Action, StoreState, EpicDependencies> = (
  action$,
  state$,
  { getResponseForDataRequest },
) =>
  action$.ofType<Action<'REQUEST_DATA'>>('REQUEST_DATA').pipe(
    mergeMap(action => {
      const {
        key,
        forPage,
        requestId,
        allowOptimisticUpdates,
      } = action.payload;

      const previousResult = getResolvedDataForKey(state$.value)(key);

      return observableOf(
        setResolvedData({
          key,
          forPage,
          data:
            allowOptimisticUpdates && isSuccessResult<any>(previousResult)
              ? {
                  ...(previousResult as any),
                  isInProgress: true,
                  requestId,
                }
              : {
                  ...pendingResult,
                  requestId,
                },
        }),
      ).pipe(
        merge(
          observableFrom(
            promiseToAsyncResult(getResponseForDataRequest(action.payload)),
          ).pipe(
            map(data =>
              // tslint:disable-next-line:no-object-literal-type-assertion
              setResolvedData({
                key,
                forPage,
                data: {
                  ...data,
                  requestId,
                },
              } as SetResolvedDataPayload<typeof key>),
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
