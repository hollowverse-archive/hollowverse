import {StyleSheet} from 'aphrodite/no-important'
import {palette} from '../../common.styles'

const {typography, backgrounds} = palette

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
    background: backgrounds[4],
    boxShadow: '0 2px 5px rgba(0,0,0,0.13), 0 2px 5px rgba(0,0,0,0.19)',
  },
  quoteContainer: {
    margin: '0.4rem 0 1.2rem 0',
    borderLeft: '3px solid rgba(103, 178, 111, 0.8)',
  },
  quotedText: {
    marginLeft: '0.8rem',
  },
  sourceTypography: {
    color: typography[2],
    fontWeight: 400,
    textDecoration: 'dotted #6b6b6b',
  },
  userComment: {
    color: typography[1],
  },
  userContainer: {
    marginTop: '0.5rem',
    display: 'flex',
    justifyContent: 'flex-end',
    textAlign: 'right',
  },
  username: {
    fontSize: '1rem',
    fontWeight: 500,
    color: typography[1],

  },
  userAvatar: {
    borderRadius: '20%',
    height: '100%',
    marginRight: '0.2rem',
    verticalAlign: 'top',
  },
})
