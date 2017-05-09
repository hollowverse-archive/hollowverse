import {StyleSheet} from 'aphrodite/no-important'

export const styles = StyleSheet.create({
  navBar: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    height: '7.5vh',
  },
  textLogo: {
    alignSelf: 'center',
    display: 'inline-block',
  },
  navBarIcon: {
    alignSelf: 'center',
    cursor: 'pointer',
    ':hover': {
      opacity: 0.85,
    },
  },
})
