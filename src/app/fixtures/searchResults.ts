export const emptySearchResults = {
  hits: [],
  hitsPerPage: 10,
  nbHits: 0,
  nbPages: 1,
  page: 0,
  params: '',
  processingTimeMS: 1,
  query: 'Tom',
};

export const stubNonEmptySearchResults = {
  hits: [
    {
      slug: 'Tom_Hanks',
      name: 'Tom Hanks',
      mainPhoto: null,
      objectID: '123',
    },
    {
      slug: 'Tom_Hardy',
      name: 'Tom Hardy',
      mainPhoto: null,
      objectID: '456',
    },
  ],
  hitsPerPage: 10,
  nbHits: 2,
  nbPages: 1,
  page: 0,
  params: '',
  processingTimeMS: 1,
  query: 'Tom',
};
