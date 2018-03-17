import { noop, times, random } from 'lodash';
import emptySvg from '!!url-loader!assets/emptySvg.svg';

export const resultsListDummyData = {
  onResultClick: noop as (path: string) => void,
  hits: times(8, n1 => ({
    objectID: n1,
    mainPhoto: {
      url: emptySvg,
    },
    name: '#'.repeat(random(10, 25)),
    slug: '#',
  })) as any[],
};
