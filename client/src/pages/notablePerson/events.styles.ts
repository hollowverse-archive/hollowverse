import {StyleSheet} from 'aphrodite/no-important'

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
    background: '#fcfcfc',
  },
  quoteContainer: {
    margin: '0.4rem 0 0.8rem 0',
    borderLeft: '1.8px solid rgba(0, 0, 0, 0.7)',
  },
  sourceTypography: {
    color: '#6b6b6b',
    fontWeight: 500,
    textDecoration: 'none',
  },
  quotedText: {
    marginLeft: '0.8rem',
  },
  userComment: {
    color: '#474747',
  },
  username: {
    textAlign: 'right',
  },
})
