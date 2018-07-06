import { createReducerForStoreKey, isActionOfType } from 'store/helpers';
import { StoreState } from 'store/types';
import { createSelector } from 'reselect';

export const themeReducer = createReducerForStoreKey<'theme'>(
  {
    TOGGLE_NIGHT_MODE: (state, action) => {
      if (isActionOfType(action, 'TOGGLE_NIGHT_MODE')) {
        return state === 'light' ? 'dark' : 'light';
      }

      return state;
    },
  },
  'light',
);

export const getTheme = (state: StoreState) => state.theme;

export const isNightModeEnabled = createSelector(
  getTheme,
  theme => theme === 'dark',
);
