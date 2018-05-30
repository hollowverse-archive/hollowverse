import { GraphQLClient } from 'graphql-request';
import memoizePromise from 'p-memoize';

const { API_ENDPOINT = 'https://api.hollowverse.com/graphql' } = process.env;

const client = new GraphQLClient(API_ENDPOINT, {
  method: 'GET',
});

const query = `
  query NotablePersonOldSlug($slug: String!) {
    notablePerson(slug: $slug) {
      oldSlug
    }
  }
`;

export const isNewSlug = memoizePromise(
  async (path: string) => {
    const result = await client.request<any>(query, {
      slug: path,
    });

    return (
      result.notablePerson !== null &&
      result.notablePerson.oldSlug !== path.toLowerCase()
    );
  },
  {
    maxAge: 43200000,
  },
);
