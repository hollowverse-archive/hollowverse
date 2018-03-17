import { stripIndents } from 'common-tags';
import { noop, times } from 'lodash';
import emptySvg from '!!url-loader!assets/emptySvg.svg';

export const resultsListDummyData = {
  onResultClick: noop as (path: string) => void,
  hits: times(3, i => ({
    objectID: i,
    mainPhoto: {
      url: emptySvg,
    },
    name: 'Lorem Temporibus',
    slug: '#',
  })) as any[],
};
