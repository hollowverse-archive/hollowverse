import { client } from 'api/client';
import query from './isNewSlugQuery.graphql';
import { NotablePersonOldSlugQuery } from 'api/types';

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
  const result = await client.request<NotablePersonOldSlugQuery>(query, {
    slug: path,
  });

  return (
    result.notablePerson !== null &&
    result.notablePerson.oldSlug !== path.toLowerCase()
  );
});
