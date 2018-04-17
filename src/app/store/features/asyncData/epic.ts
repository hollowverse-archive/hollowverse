// tslint:disable no-unnecessary-type-assertion
import { setResolvedData } from './actions';

import { Action, StoreState, SetResolvedDataPayload } from 'store/types';

import { Epic } from 'redux-observable';

import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/merge';
import 'rxjs/add/operator/takeUntil';
import 'rxjs/add/operator/filter';
import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/observable/of';

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
  store,
  { getResponseForDataRequest },
) => {
  return action$.ofType('REQUEST_DATA').mergeMap(action => {
    const {
      key,
      forPage,
      requestId,
      allowOptimisticUpdates,
    } = (action as Action<'REQUEST_DATA'>).payload;

    const previousResult = getResolvedDataForKey(store.getState())(key);

    return Observable.of(
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
    )
      .merge(
        Observable.fromPromise(
          promiseToAsyncResult(
            getResponseForDataRequest(
              (action as Action<'REQUEST_DATA'>).payload,
            ),
          ),
        ).map(data =>
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
      )
      .takeUntil(
        action$.filter(
          newAction =>
            isActionOfType(newAction, 'REQUEST_DATA') &&
            newAction.payload.key === key,
        ),
      );
  });
};
