import { GraphQLClient } from 'graphql-request';
export const client = new GraphQLClient('https://api.hollowverse.com/graphql');

// tslint:disable-next-line:no-multiline-string
const query = `
  query NotablePerson($slug: String!) {
    notablePerson(slug: $slug) {
      slug
    }
  }
`;

export const isNewSlug = async (path: string) => {
  const result = await client.request<any>(query, { slug: path });

  return result.notablePerson !== null;
};
