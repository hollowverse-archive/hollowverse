import { push } from 'react-router-redux';

import { Action, StoreState } from 'store/types';

import { Epic } from 'redux-observable';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/observable/of';

export const searchEpic: Epic<Action, StoreState> = action$ => {
  return action$.ofType('REQUEST_SEARCH_RESULTS').mergeMap(action => {
    const { query } = (action as Action<'REQUEST_SEARCH_RESULTS'>).payload;
    const searchParams = new URLSearchParams();
    searchParams.append('query', query);

    return Observable.of(
      push({
        search: searchParams.toString(),
      }),
    );
  });
};
