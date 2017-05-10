import {StyleSheet} from 'aphrodite/no-important'

const gradient = 'linear-gradient(20deg, #ffb347 30%, #ffcc33 95%)'

export const styles = StyleSheet.create({
  pageNotablePerson: {
    height: '100%',
  },
  notablePersonTitleContainer: {
    display: 'flex',
    marginTop: '1.5rem',
    justifyContent: 'center',
  },
  notablePersonPhoto: {
    maxWidth: '150px',
    borderRadius: '80px',
    margin: '0 1.5rem',
  },
  notablePersonText: {
    marginTop: '1rem',
  },
  notablePersonTitle: {
    color: '#333',
    fontStyle: 'italic',
  },
  notablePersonName: {
    color: '#333',
    margin: '0.25rem 0.25rem',
  },
  notablePersonLabel: {
    background: gradient,
    color: 'smoke',
    alignItems: 'center',
    borderRadius: '290486px',
    display: 'inline-flex',
    fontSize: '.75rem',
    height: '2em',
    justifyContent: 'center',
    lineHeight: '1.5',
    paddingLeft: '.875em',
    paddingRight: '.875em',
    whiteSpace: 'nowrap',
    margin: '0.25rem 0.25rem',
  },
})
