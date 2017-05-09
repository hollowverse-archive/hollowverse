import {StyleSheet} from 'aphrodite/no-important'

export const styles = StyleSheet.create({
  pageHomepage: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  title: {
    color: '#333',
  },
  searchForm: {
    marginTop: '1.5rem',
  },
  searchButtonContainer: {
    display: 'flex',
    marginTop: '1.5rem',
    justifyContent: 'center',
  },
  searchInput: {
    alignItems: 'center',
    backgroundColor: 'white',
    border: '1px solid #dbdbdb',
    boxShadow: 'inset 0 1px 2px rgba(10, 10, 10, .1)',
    borderRadius: '3px',
    color: '#333',
    height: '2.25em',
    lineHeight: '1.5em',
    maxWidth: '100%',
    position: 'relative',
    padding: '0.40rem',
    verticalAlign: 'top',
    width: '100%',
    ':active, :focus': {
      border: '1.3px solid #67B26F',
      outline: 0,
    },
  },
  searchButton: {
    alignItems: 'center',
    border: 'none',
    borderColor: 'transparent',
    borderRadius: '3px',
    cursor: 'pointer',
    display: 'flex',
    height: '2.5rem',
    justifyContent: 'center',
    textDecoration: 'none',
    width: '6rem',
    ':hover': {
      opacity: 0.9,
      color: 'white',
    },
  },
})
