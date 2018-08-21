import { createReducerForStoreKey, isActionOfType } from 'store/helpers';
import { StoreState } from 'store/types';
import { createSelector } from 'reselect';
import { createMuiTheme } from '@material-ui/core/styles';
import green from '@material-ui/core/colors/green';
import orange from '@material-ui/core/colors/orange';
import indigo from '@material-ui/core/colors/indigo';
import yellow from '@material-ui/core/colors/yellow';

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

export const getMuiTheme = createSelector(getTheme, theme =>
  createMuiTheme({
    breakpoints: {
      values: {
        xs: 0,
        sm: 720,
        md: 960,
        lg: 1280,
        xl: 1920,
      },
    },
    typography: {
      fontFamily: 'var(--font-family)',
      fontSize: 14,
      display1: {
        fontSize: 26,
      },
      body1: {
        fontSize: 16,
        lineHeight: 1.6,
      },
      body2: {
        fontSize: 15,
      },
      title: {
        lineHeight: 1.6,
        fontWeight: 700,
      },
    },
    palette: {
      type: theme,
      primary: theme === 'dark' ? yellow : indigo,
      secondary: theme === 'dark' ? orange : green,
    },
    overrides: {
      MuiTypography: {
        gutterBottom: {
          marginBottom: '15px',
        },
      },
      MuiMenu: {
        paper: {
          minWidth: 250,
        },
      },
      MuiPaper: {
        root: {
          marginBottom: 10,
        },
      },
      MuiTooltip: {
        tooltip: {
          fontSize: 13,
        },
      },
      MuiExpansionPanel: {
        expanded: {
          marginTop: 0,
          '&::before': {
            opacity: 'inherit',
          },
        },
      },
    },
    props: {
      MuiTooltip: {
        enterDelay: 400,
      },
      MuiPaper: {
        elevation: 1,
      },
    },
  }),
);
