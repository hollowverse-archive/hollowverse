import { map, distinctUntilChanged, tap, ignoreElements } from 'rxjs/operators';

import { Action, StoreState } from 'store/types';

import { Epic } from 'redux-observable';

import { EpicDependencies } from 'store/createConfiguredStore';
import { getTheme } from './reducer';

export const themeEpic: Epic<Action, StoreState, EpicDependencies> = (
  _action$,
  state$,
) => {
  const html = document.querySelector('html');

  return state$.pipe(
    map(getTheme),
    distinctUntilChanged(),
    tap(theme => {
      if (html) {
        if (theme === 'dark') {
          html.classList.add('night-mode');
        } else {
          html.classList.remove('night-mode');
        }
      }
    }),
    ignoreElements(),
  );
};
