import { GraphQLClient } from 'graphql-request';
import { memoizeOnSuccess } from 'memoizeOnSuccess';

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

export const isNewSlug = memoizeOnSuccess(async (path: string) => {
  const result = await client.request<any>(query, {
    slug: path,
  });

  return (
    result.notablePerson !== null &&
    result.notablePerson.oldSlug !== path.toLowerCase()
  );
});
