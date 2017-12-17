import { routerReducer, RouterState } from 'react-router-redux';
import { combineReducers, Reducer as GenericReducer } from 'redux';
import { StoreState, ReducerMap } from './types';
import { statusCodeReducer } from 'store/features/status/reducer';
import {
  searchResultsReducer,
  lastSearchMatchReducer,
} from 'store/features/search/reducer';

const appReducers: ReducerMap = {
  statusCode: statusCodeReducer,
  searchResults: searchResultsReducer,
  lastSearchMatch: lastSearchMatchReducer,
};

/**
 * This is the root reducer of the app.
 * It includes Hollowverse `appReducer` as well as other reducers
 * that may be required by external modules.
 */
export const reducer = combineReducers<StoreState>({
  ...appReducers,
  routing: routerReducer as GenericReducer<RouterState>,
});
