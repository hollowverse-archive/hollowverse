import {StyleSheet} from 'aphrodite/no-important'

const gradient = 'linear-gradient(60deg, #67B26F 30%, #4ca2cd 95%)'

export const styles = StyleSheet.create({
  pageHomepage: {
    alignItems: 'center',
    display: 'flex',
    height: '92.5vh',
    justifyContent: 'center',
  },
  title: {
    color: '#333',
    fontSize: '1.1rem',
    fontFamily: 'Roboto Medium',
  },
  searchForm: {
    marginTop: '1.5rem',
  },
  searchButtonContainer: {
    display: 'flex',
    marginTop: '1.5rem',
    justifyContent: 'center',
  },
  searchButton: {
    alignItems: 'center',
    background: gradient,
    border: 'none',
    borderColor: 'transparent',
    borderRadius: '3px',
    cursor: 'pointer',
    color: 'whitesmoke',
    display: 'flex',
    fontSize: '1rem',
    fontFamily: 'Roboto',
    fontWeight: 500,
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
