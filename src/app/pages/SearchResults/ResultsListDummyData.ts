import { noop, times, random } from 'lodash';
import { ResultsListProps } from './ResultsList';
import emptySvg from '!!url-loader!assets/emptySvg.svg';

export const resultsListDummyData: Pick<
  ResultsListProps,
  'onResultClick' | 'hits'
> = {
  onResultClick: noop,
  hits: times(8, n1 => ({
    objectID: n1,
    mainPhoto: {
      url: emptySvg,
    },
    name: '#'.repeat(random(10, 25)),
    slug: '#',
  })),
};
