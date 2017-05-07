import { StyleSheet } from 'aphrodite/no-important'

// Injecting a mock property to app.tsx for testing purposes.

const gradient = 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)'

export const styles = StyleSheet.create({
  gradients: {
    background: gradient,
  },
})
