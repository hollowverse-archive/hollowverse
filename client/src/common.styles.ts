import {StyleSheet} from 'aphrodite/no-important'

// You can import these to your styles to create accents,
// colors go from dark to light in index.
export const palette = {
  typography: [
    '#303030',
    '#333333',
    '#474747',
    '#6b6b6b',
    '#fcfcfc',
    '#f5f5f5',
    '#ffffff',
  ],
  backgrounds: [
    '#f5f5f5',
    '#f0f0f0',
    '#fcfcfc',
    '#ffffff',
  ],
}

// Global styles- use in your classes whenever you can
export const common = StyleSheet.create({
  page: {
    height: '100%',
  },
  palette: {
    background: 'linear-gradient(45deg, #67B26F 40%, #4ca2cd 95%)',
    color: palette.backgrounds[1],
  },
  titleTypography: {
    fontFamily: 'Roboto Medium',
    fontWeight: 500,
    fontSize: '1.3rem',
  },
  textTypography: {
    fontFamily: 'Roboto',
    fontWeight: 400,
    fontSize: '1rem',
  },
})
