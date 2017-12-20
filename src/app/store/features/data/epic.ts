import { setResolvedData } from './actions';

import { Action, StoreState } from 'store/types';

import { Epic } from 'redux-observable';

import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/merge';
import 'rxjs/add/operator/takeUntil';
import 'rxjs/add/operator/filter';
import 'rxjs/add/observable/fromPromise';

import { promiseToAsyncResult, pendingResult } from 'helpers/asyncResults';
import { isActionOfType } from 'store/helpers';

export const dataResolverEpic: Epic<Action, StoreState> = action$ => {
  return action$.ofType('REQUEST_DATA').mergeMap(action => {
    const { key, resolve } = (action as Action<'REQUEST_DATA'>).payload;

    return Observable.of(setResolvedData({ key, data: pendingResult })).merge(
      Observable.fromPromise(promiseToAsyncResult(resolve()))
        .map(data =>
          setResolvedData({ key, data: { ...data, isResolved: true } }),
        )
        .takeUntil(
          action$.filter(
            newAction =>
              isActionOfType(newAction, 'REQUEST_DATA') &&
              newAction.payload.key === key,
          ),
        ),
    );
  });
};
