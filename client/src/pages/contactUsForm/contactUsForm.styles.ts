import {StyleSheet} from 'aphrodite/no-important'
import {palette} from '../../common.styles'

const {shadesOfWhite, shadesOfBlack} = palette

export const styles = StyleSheet.create({
  pageContactForm: {
    alignItems: 'center',
    display: 'flex',
    height: '100%',
    justifyContent: 'center',
  },
  formContainer: {
    backgroundColor: shadesOfWhite[1],
    padding: '3rem 3rem 0rem',
    width: '100%',
    height: '100%',
  },
  formTitle: {
    color: shadesOfBlack[1],
    textAlign: 'center',
    fontSize: '1.7rem',
  },
  contactForm: {
    display: 'inline-block',
    margin: '1.3rem 0 .4rem',
  },
  textArea: {
    minHeight: '10rem',
  },
  submitButtonContainer: {
    display: 'flex',
    marginTop: '1.5rem',
    justifyContent: 'center',
  },
  formInput: {
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
      border: '1.3px solid #4ca2cd',
      outline: 0,
    },
  },
  submitButton: {
    alignItems: 'center',
    border: 'none',
    borderColor: 'transparent',
    borderRadius: '4px',
    cursor: 'pointer',
    display: 'flex',
    height: '2.2rem',
    justifyContent: 'center',
    textDecoration: 'none',
    marginTop: '1.3rem',
    width: '6rem',
    ':hover': {
      color: shadesOfWhite[5],
      opacity: 0.9,
    },
    ':disabled': {
      opacity: '0.70',
    },
  },
})
