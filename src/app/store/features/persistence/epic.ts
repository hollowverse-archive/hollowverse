import { tap, map, ignoreElements, distinctUntilChanged } from 'rxjs/operators';

import { Action, StoreState } from 'store/types';

import { Epic } from 'redux-observable';

import { EpicDependencies } from 'store/createConfiguredStore';

export const persistenceEpic: Epic<Action, StoreState, EpicDependencies> = (
  _action$,
  state$,
  { getStateToPersist, persistState },
) => {
  return state$.pipe(
    map(getStateToPersist),
    distinctUntilChanged(),
    tap(persistState),
    ignoreElements(),
  );
};
