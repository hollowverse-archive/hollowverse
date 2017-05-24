import {StyleSheet} from 'aphrodite/no-important'
import {palette} from '../../common.styles'

const {shadesOfBlack} = palette

export const styles = StyleSheet.create({
  shadowTopContainer: {
    marginBottom: '2.5rem',
  },
  shadowPhoto: {
    background: shadesOfBlack[4],
    borderRadius: '50%',
    height: '150px',
    minWidth: '150px',
  },
  shadowLabels: {
    background: shadesOfBlack[4],
    height: '1.1rem',
    width: '6rem',
  },
  shadowName: {
    background: shadesOfBlack[4],
    borderRadius: '30px',
    height: '1.2rem',
    marginTop: '1rem',
    width: '12rem',
  },
  shadowContainer: {
    height: '10rem',
    marginBottom: '2rem',
    paddingBottom: '9rem',
  },
  shadowContent: {
    background: shadesOfBlack[4],
    height: '0.75rem',
    marginLeft: '1rem',
    width: '90%',
  },
  shadowContentIndented: {
    marginLeft: '2rem',
    width: '85%',
  },
  shadowUserComment: {
    width: '80%',
  },
  shadowUsername: {
    marginTop: '1rem',
    height: '0.65rem',
    width: '13.5%',
  },
})
