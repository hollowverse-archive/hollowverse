import {StyleSheet} from 'aphrodite/no-important'
import {palette} from '../../common.styles'

const {shadesOfBlack, shadesOfWhite} = palette

export const styles = StyleSheet.create({
  eventsContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  eventContent: {
    background: shadesOfWhite[4],
    border: '1px solid rgba(235, 235, 235, 1)',
    borderRadius: '3px',
    boxShadow: '0 2px 5px rgba(0,0,0,0.13), 0 2px 5px rgba(0,0,0,0.19)',
    padding: '1rem 1rem',
    margin: '0.8rem 0.8rem',
  },
  quoteContainer: {
    borderLeft: '3px solid rgba(103, 178, 111, 0.8)',
    margin: '0.4rem 0 1.2rem 0',
  },
  quotedText: {
    marginLeft: '0.8rem',
  },
  sourceTypography: {
    color: shadesOfBlack[2],
    fontWeight: 400,
    textDecoration: 'dotted #6b6b6b',
  },
  userComment: {
    color: shadesOfBlack[1],
  },
  userContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: '0.5rem',
    textAlign: 'right',
  },
  username: {
    color: shadesOfBlack[1],
    fontSize: '1rem',
    fontWeight: 500,

  },
  userAvatar: {
    borderRadius: '20%',
    height: '100%',
    marginRight: '0.2rem',
    verticalAlign: 'top',
  },
})
