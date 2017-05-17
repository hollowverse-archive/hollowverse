import {StyleSheet} from 'aphrodite/no-important'
import {palette} from '../../common.styles'

export const styles = StyleSheet.create({
  eventsContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  eventContent: {
    padding: '1rem 1rem',
    border: '1px solid rgba(235, 235, 235, 1)',
    borderRadius: '3px',
    margin: '0.8rem 0.8rem',
    background: palette.typography[3],
    boxShadow: '0 2px 5px rgba(0,0,0,0.13), 0 2px 5px rgba(0,0,0,0.19)',
  },
  quoteContainer: {
    margin: '0.4rem 0 0.5rem 0',
    borderLeft: '2.5px solid rgba(103, 178, 111, 0.8)',
  },
  quotedText: {
    marginLeft: '0.8rem',
  },
  sourceTypography: {
    color: palette.typography[2],
    fontWeight: 400,
    textDecoration: 'dotted #6b6b6b',
  },
  userComment: {
    color: palette.typography[1],
  },
  userContainer: {
    marginTop: '0.5rem',
    display: 'flex',
    justifyContent: 'flex-end',
    textAlign: 'right',
  },
  username: {
    fontSize: '1.03rem',
  },
  userAvatar: {
    borderRadius: '20%',
    height: '100%',
    marginRight: '0.2rem',
    verticalAlign: 'top',
  },
})
