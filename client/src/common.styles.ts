/*
    Common Styles and Guidelines
    -all values subject to change-
*/

import {StyleSheet} from 'aphrodite/no-important'

const gradient = 'linear-gradient(45deg, #67B26F 40%, #4ca2cd 95%)'

export const common = StyleSheet.create({
  palette: {
    background: gradient,
    color: 'whitesmoke',
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
