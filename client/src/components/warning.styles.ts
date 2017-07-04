import { StyleSheet } from 'aphrodite/no-important';
import { palette } from 'common.styles';

const { shadesOfBlack } = palette;

export const styles = StyleSheet.create({
  warningBar: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(45deg, #ffb347 30%, #ffcc33 95%)',
    height: '3vh',
  },
  closeButton: {
    marginLeft: '1rem',
    color: shadesOfBlack[2],
    cursor: 'pointer',
    ':hover': {
      opacity: 0.85,
    },
  },
  warningMessage: {
    fontWeight: 500,
    fontSize: '.9rem',
    color: shadesOfBlack[2],
    alignSelft: 'center',
    textDecoration: 'none',
  },
});
