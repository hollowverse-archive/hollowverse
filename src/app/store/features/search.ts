import algoliasearch from 'algoliasearch';

import {
  createActionCreator,
  handleActions,
  isActionOfType,
} from 'store/helpers';
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

export const requestSearchResults = createActionCreator(
  'REQUEST_SEARCH_RESULTS',
);
export const setSearchResults = createActionCreator('SET_SEARCH_RESULTS');
export const setSearchError = createActionCreator('SET_SEARCH_ERROR');

const SERACH_ONLY_API_KEY = 'd970947e688348297451c41746235cd5';
const APP_ID = '33DEXZ8MDK';

const searchClient = algoliasearch(APP_ID, SERACH_ONLY_API_KEY);

export const searchReducer = handleActions<'searchResults'>(
  {
    SET_SEARCH_RESULTS: (state, action) => {
      if (isActionOfType(action, 'SET_SEARCH_RESULTS')) {
        return {
          isInProgress: false,
          hasError: false,
          value: action.payload.results,
        };
      }

      return state;
    },
    SET_SEARCH_ERROR: (state, action) => {
      if (isActionOfType(action, 'SET_SEARCH_ERROR')) {
        return {
          isInProgress: false,
          hasError: true,
          value: null,
        };
      }

      return state;
    },
    REQUEST_SEARCH_RESULTS: (state, action) => {
      if (isActionOfType(action, 'REQUEST_SEARCH_RESULTS')) {
        return {
          ...state, // Keep previous results while fetching new results
          isInProgress: true,
          hasError: false,
        };
      }

      return state;
    },
  },
  {
    hasError: false,
    isInProgress: false,
    value: null,
  },
);

export const searchEpic: Epic<Action, StoreState> = action$ =>
  action$.ofType('REQUEST_SEARCH_RESULTS').mergeMap(action =>
    Observable.fromPromise(
      searchClient
        .initIndex('notablePerson-dev')
        .search((action as Action<'REQUEST_SEARCH_RESULTS'>).payload.query),
    )
      .takeUntil(action$.ofType('REQUEST_SEARCH_RESULTS')) // Cancel pending search requests
      .map(results => setSearchResults({ results }))
      .catch(error => Observable.of(setSearchError({ error }))),
  );
