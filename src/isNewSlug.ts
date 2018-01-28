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

const memoizeOnSuccess = <T extends string, R>(
  fn: ((arg: T) => Promise<R>),
) => {
  const map = new Map<string, R>();

  return async (arg: T) => {
    const cachedResult = map.get(arg);
    if (cachedResult !== undefined) {
      return cachedResult;
    }

    const result = await fn(arg);
    map.set(arg, result);

    return result;
  };
};

export const isNewSlug = memoizeOnSuccess(async (path: string) => {
  const result = await client.request<any>(query, { slug: path });

  return result.notablePerson !== null;
});
