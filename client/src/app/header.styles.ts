import {StyleSheet} from 'aphrodite/no-important'

export const styles = StyleSheet.create({
  navBar: {
    backgroundColor: '#00c4a7',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    height: '7vh',
  },
  textLogo: {
    alignSelf: 'center',
    color: '#fff',
    fontFamily: 'Roboto Medium',
    fontSize: '1.3rem',
    display: 'inline-block',
  },
  navBarIcon: {
    margin: '7rem',
    alignSelf: 'center',
    color: 'whitesmoke',
    cursor: 'pointer',
  },
})
