import {StyleSheet} from 'aphrodite/no-important'

const gradient = 'linear-gradient(45deg, #67B26F 40%, #4ca2cd 95%)'

export const styles = StyleSheet.create({
  navBar: {
    background: gradient,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    height: '7vh',
  },
  textLogo: {
    alignSelf: 'center',
    color: '#fff',
    display: 'inline-block',
    fontFamily: 'Roboto Medium',
    fontSize: '1.3rem',
  },
  navBarIcon: {
    alignSelf: 'center',
    color: 'whitesmoke',
    cursor: 'pointer',
  },
})
