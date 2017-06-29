import * as algoliasearch from 'algoliasearch';

export interface IAlgoliaSearchResults {
  hits: Array<{}>;
}

interface IAlgoliaSearchIndex {
  search(
    params: algoliasearch.AlgoliaQueryParameters,
  ): Promise<IAlgoliaSearchResults>;
}

const algoliasearchClient = algoliasearch(
  'UYLR9FKOFC',
  '4d7b78dec6513ecc3c1b0ddaf9a68a78',
);

export const algoliaSearchIndex: IAlgoliaSearchIndex = algoliasearchClient.initIndex(
  'getstarted_actors',
);
