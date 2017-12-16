import algolia from 'algoliasearch';

import { setSearchError, setSearchResults } from './actions';

import { Action, StoreState } from 'store/types';

import { Epic } from 'redux-observable';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mapTo';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/takeUntil';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/observable/of';

const SEARCH_ONLY_API_KEY = 'd970947e688348297451c41746235cd5';
const APP_ID = '33DEXZ8MDK';

const client = algolia(APP_ID, SEARCH_ONLY_API_KEY);

export const searchEpic: Epic<Action, StoreState> = action$ =>
  action$.ofType('REQUEST_SEARCH_RESULTS').mergeMap(action =>
    Observable.fromPromise(
      client
        .initIndex('notablePerson-dev')
        .search((action as Action<'REQUEST_SEARCH_RESULTS'>).payload.query),
    )
      .map(results => setSearchResults({ results }))
      // Ignore pending search requests when a new request is dispatched
      .takeUntil(action$.ofType('REQUEST_SEARCH_RESULTS'))
      .catch(error => Observable.of(setSearchError({ error }))),
  );
