import { StyleSheet } from 'aphrodite/no-important'

const spinnerKeyFrames = {
  '0%': {
    transform: 'rotate(0deg)',
  },
  '100%': {
    transform: 'rotate(360deg)',
  },
}

export const styles = StyleSheet.create({
  globalSpinner: {
    animationName: spinnerKeyFrames,
    animationDuration: '1.1s',
    animationIterationCount: 'infinite',
    animationTimingFunction: 'linear',
    borderTop: '1em solid rgba(103, 178, 111, 0.2)',
    borderRight: '1em solid rgba(103, 178, 111, 0.2)',
    borderBottom: '1em solid rgba(103, 178, 111, 0.2)',
    borderLeft: '1em solid rgba(103, 178, 111, 0.8)',
    borderRadius: '50%',
    fontSize: '0.8rem',
    height: '10em',
    margin: 'auto',
    position: 'fixed',
    transform: 'translateZ(0)',
    width: '10em',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  container: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    content: '',
    display: 'block',
    top: 0,
    left: 0,
    position: 'fixed',
    width: '100vw',
    height: '100vh',
    zIndex: 999,
  },
})
