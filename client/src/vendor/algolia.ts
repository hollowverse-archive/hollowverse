import * as algoliasearch from 'algoliasearch';

export interface AlgoliaSearchResults {
  hits: object[];
}

interface AlgoliaSearchIndex {
  search(
    params: algoliasearch.AlgoliaQueryParameters,
  ): Promise<AlgoliaSearchResults>;
}

const algoliasearchClient = algoliasearch(
  'UYLR9FKOFC',
  '4d7b78dec6513ecc3c1b0ddaf9a68a78',
);

export const algoliaSearchIndex: AlgoliaSearchIndex = algoliasearchClient.initIndex(
  'getstarted_actors',
);
