import algoliasearch = require('algoliasearch')

export interface IAlgoliaSearchResults {
  hits: Array<{}>
}

interface AlgoliaSearchIndex {
  search(params: algoliasearch.AlgoliaQueryParameters): Promise<IAlgoliaSearchResults>
}

const algoliasearchClient = algoliasearch('UYLR9FKOFC', '4d7b78dec6513ecc3c1b0ddaf9a68a78')

export const algoliaSearchIndex: AlgoliaSearchIndex = algoliasearchClient.initIndex('getstarted_actors')
