import idbKeyVal from 'idb-keyval';

import { tap, map, ignoreElements, distinctUntilChanged } from 'rxjs/operators';

import { Action, StoreState } from 'store/types';

import { Epic } from 'redux-observable';

import { EpicDependencies } from 'store/createConfiguredStore';

const getStateToPersist = ({ theme }: StoreState) => {
  return { theme };
};

export const persistenceEpic: Epic<Action, StoreState, EpicDependencies> = (
  _action$,
  state$,
) => {
  return state$.pipe(
    map(getStateToPersist),
    distinctUntilChanged(),
    tap(async state => {
      await idbKeyVal.set('state', state);
    }),
    ignoreElements(),
  );
};
