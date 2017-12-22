import { setResolvedData } from './actions';

import { Action, StoreState } from 'store/types';

import { Epic } from 'redux-observable';

import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/merge';
import 'rxjs/add/operator/takeUntil';
import 'rxjs/add/operator/filter';
import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/observable/of';

import { promiseToAsyncResult, pendingResult } from 'helpers/asyncResults';
import { isActionOfType } from 'store/helpers';

export const dataResolverEpic: Epic<Action, StoreState> = (action$, store) => {
  return action$.ofType('REQUEST_DATA').mergeMap(action => {
    const {
      key,
      resolve,
      requestId,
      allowOptimisticUpdates,
    } = (action as Action<'REQUEST_DATA'>).payload;

    return Observable.of(
      setResolvedData({
        key,
        data: allowOptimisticUpdates
          ? {
              ...store.getState().resolvedData[key],
              hasError: false,
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
        Observable.fromPromise(promiseToAsyncResult(resolve())).map(data =>
          setResolvedData({ key, data: { ...data, requestId } }),
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
