import {StyleSheet} from 'aphrodite/no-important'

export const styles = StyleSheet.create({
  navBar: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    height: '7.5vh',
    boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.28)',
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
