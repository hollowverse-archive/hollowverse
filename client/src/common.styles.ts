/*
  Common Styles and Guidelines
  -values subject to change-
*/

import {StyleSheet} from 'aphrodite/no-important'

const gradient = 'linear-gradient(45deg, #67B26F 40%, #4ca2cd 95%)'

export const common = StyleSheet.create({
  palette: {
    background: gradient,
    color: 'whitesmoke',
  },
  titleFont: {
    fontFamily: 'Roboto Medium',
    fontWeight: 500,
    fontSize: '1.3rem',
  },
  textFont: {
    fontFamily: 'Roboto',
    fontWeight: 400,
    fontSize: '1.1rem',
  },
  spacing: {
    marginTop: '1.5rem',
    marginBottom: '1.5rem',
  },
})
