import {StyleSheet} from 'aphrodite/no-important'

const gradient = 'linear-gradient(90deg, #67B26F 40%, #4ca2cd 95%)'

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
    margin: '0.4rem 0 0.5rem 0',
    borderLeft: '2.5px solid rgba(103, 178, 111, 0.8)',
  },
  sourceTypography: {
    color: '#6b6b6b',
    fontWeight: 400,
    textDecoration: 'dotted #6b6b6b',
  },
  quotedText: {
    marginLeft: '0.8rem',
  },
  userComment: {
    color: '#474747',
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
  },
})
