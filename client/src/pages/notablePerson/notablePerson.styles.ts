import {StyleSheet} from 'aphrodite/no-important'
import {palette} from '../../common.styles'

const {shadesOfBlack} = palette

export const styles = StyleSheet.create({
  notablePersonTitleContainer: {
    display: 'flex',
    justifyContent: 'center',
    margin: '0.8rem 0.8rem',
  },
  notablePersonPhoto: {
    borderRadius: '50%',
    maxWidth: '80%',
    margin: '0.7rem 0.25rem 0 0',
  },
  notablePersonText: {
    margin: '1.3rem 1rem 0 0',
  },
  notablePersonTitle: {
    color: shadesOfBlack[1],
    fontStyle: 'italic',
  },
  notablePersonName: {
    color: shadesOfBlack[1],
    fontWeight: 500,
    fontSize: '1.5rem',
    margin: '0.25rem 0.25rem 0.40rem 0.5rem',
  },
  notablePersonLabel: {
    alignItems: 'center',
    borderRadius: '30px',
    background: 'linear-gradient(20deg, #ffb347 30%, #ffcc33 95%)',
    color: shadesOfBlack[0],
    display: 'inline-flex',
    fontSize: '.75rem',
    height: '1.5rem',
    justifyContent: 'center',
    lineHeight: '1.5',
    margin: '0.25rem 0.25rem',
    paddingLeft: '.7rem',
    paddingRight: '.7rem',
    whiteSpace: 'nowrap',
  },
  eventsContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  eventContent: {
    border: '1px solid gray',
    padding: '1rem 1rem',
    margin: '0.8rem 0.8rem',
  },
})
