import { StyleSheet } from 'aphrodite/no-important';
import { palette } from 'common.styles';

const { shadesOfWhite, shadesOfBlack } = palette;

export const styles = StyleSheet.create({
  pageHomepage: {
    alignItems: 'center',
    display: 'flex',
    height: '100%',
    justifyContent: 'center',
  },
  searchContainer: {
    backgroundColor: shadesOfWhite[1],
    borderRadius: '10px',
    padding: '2rem',
    width: '70vw',
  },
  title: {
    color: shadesOfBlack[1],
    textAlign: 'center',
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
    backgroundColor: shadesOfWhite[3],
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
      color: shadesOfWhite[5],
      opacity: 0.9,
    },
  },
});
