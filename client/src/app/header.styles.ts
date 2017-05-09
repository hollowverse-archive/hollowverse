import {StyleSheet} from 'aphrodite/no-important'

const gradient = 'linear-gradient(45deg, #67B26F 40%, #4ca2cd 95%)'

export const styles = StyleSheet.create({
  navBar: {
    background: gradient,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    height: '7.5vh',
  },
  textLogo: {
    alignSelf: 'center',
    color: '#fff',
    display: 'inline-block',
    fontFamily: 'Roboto Medium',
    fontWeight: 500,
    fontSize: '1.3rem',
  },
  navBarIcon: {
    alignSelf: 'center',
    color: 'whitesmoke',
    cursor: 'pointer',
    ':hover': {
      opacity: 0.85,
    },
  },
})
