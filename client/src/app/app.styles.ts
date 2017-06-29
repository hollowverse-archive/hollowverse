import { StyleSheet } from 'aphrodite/no-important';
import { palette } from '../common.styles';

const { shadesOfWhite } = palette;

export const styles = StyleSheet.create({
  mainApp: {
    flex: 1,
    background: shadesOfWhite[3],
  },
  pageContent: {
    flex: 1,
    height: '92.5vh',
  },
});
