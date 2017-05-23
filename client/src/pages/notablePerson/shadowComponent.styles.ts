import {StyleSheet} from 'aphrodite/no-important'
import {palette} from '../../common.styles'

const {shadesOfBlack} = palette

export const styles = StyleSheet.create({
  shadowPhoto: {
    background: shadesOfBlack[4],
    borderRadius: '50%',
    height: '150px',
    width: '200px',
  },
  shadowLabels: {
    background: shadesOfBlack[4],
    height: '1.3rem',
    width: '6rem',
  },
  shadowName: {
    background: shadesOfBlack[4],
    borderRadius: '30px',
    height: '1.3rem',
    marginTop: '1rem',
    width: '12rem',
  },
  shadowContainer: {
    height: '10rem',
    marginBottom: '2rem',
  },
  shadowContent: {
    background: shadesOfBlack[4],
    height: '0.8rem',
    marginLeft: '1rem',
    width: '90%',
  },
  shadowContentIndented: {
    marginLeft: '2rem',
    width: '85%',
  },
  shadowUserContent: {
    marginLeft: 0,
    height: '0.75rem',
    width: '95%',
  },
})
