import { StyleSheet } from 'aphrodite/no-important';
import { palette } from '../../common.styles';

const { shadesOfBlack } = palette;

export const styles = StyleSheet.create({
  shadowTopContainer: {
    marginBottom: '2.5rem',
  },
  shadowPhoto: {
    background: shadesOfBlack[4],
    borderRadius: '50%',
    minWidth: '150px',
    minHeight: '100%',
    margin: '0.7rem 0.5rem 0 0',
  },
  shadowLabels: {
    background: shadesOfBlack[4],
    height: '1.3rem',
    width: '5.5rem',
  },
  shadowName: {
    background: shadesOfBlack[4],
    borderRadius: '30px',
    height: '1.2rem',
    marginBottom: '.9rem',
    marginTop: '1rem',
    width: '12rem',
  },
  shadowContainer: {
    height: '10rem',
    marginBottom: '2rem',
    paddingBottom: '9rem',
  },
  shadowContent: {
    background: shadesOfBlack[4],
    height: '0.70rem',
    marginLeft: '1rem',
    width: '90%',
  },
  shadowContentIndented: {
    marginLeft: '2rem',
    width: '85%',
  },
  shadowUserComment: {
    width: '80%',
  },
  shadowUsername: {
    background: shadesOfBlack[6],
    marginTop: '1rem',
    height: '0.65rem',
    width: '13.5%',
  },
});

/* For future use.
const mockAnimation = {
  '0%': {
    backgroundPosition: '-500px 0',
  },
  '100%': {
    backgroundPosition: '500px 0',
  },
    mockAnimation: {
    animationDuration: '2s',
    animationIterationCount: 'infinite',
    animationName: mockAnimation,
    animationTimingFunction: 'linear',
    background: 'linear-gradient(to right, #eeeeee 8%, #dddddd 18%, #eeeeee 33%)',
    backgroundSize: '100%',
  },
}
*/
