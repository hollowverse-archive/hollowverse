import { noop, times, sample } from 'lodash';
import emptySvg from '!!url-loader!assets/emptySvg.svg';

export const resultsListDummyData = {
  onResultClick: noop as (path: string) => void,
  hits: times(8, n1 => ({
    objectID: n1,
    mainPhoto: {
      url: emptySvg,
    },
    // Generate a name of random length between 10 and 25 chars of `#`
    name: sample(times(15, n2 => `${'#'.repeat(10)}${'#'.repeat(n2)}`)),
    slug: '#',
  })) as any[],
};
