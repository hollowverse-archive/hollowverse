import {StyleSheet} from 'aphrodite/no-important'
import {palette} from '../common.styles'

export const styles = StyleSheet.create({
  shadowPhoto: {
    background: 'gainsboro',
    width: '200px',
    height: '150px',
    borderRadius: '50%',
  },
  shadowLabels: {
    background: 'gainsboro',
    width: '6rem',
    height: '1.3rem',
  },
  shadowName: {
    marginTop: '1rem',
    background: 'gainsboro',
    width: '12rem',
    height: '1.3rem',
    borderRadius: '30px',
  },
  shadowContainer: {
    height: '10rem',
    marginBottom: '2rem',
  },
  shadowContent: {
    background: 'gainsboro',
    marginLeft: '1rem',
    width: '90%',
    height: '0.8rem',
  },
  shadowContentIndented: {
    marginLeft: '2rem',
    width: '85%',
  },
  shadowUserContent: {
    marginLeft: 0,
    width: '95%',
    height: '0.75rem',
  },
})
