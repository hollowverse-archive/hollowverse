import { client } from 'api/client';
import query from './isNewSlugQuery.graphql';
import { NotablePersonOldSlugQuery } from 'api/types';
import { memoizeOnSuccess } from 'helpers/memoizeOnSuccess';

export const isNewSlug = memoizeOnSuccess(async (path: string) => {
  const result = await client.request<NotablePersonOldSlugQuery>(query, {
    slug: path,
  });

  return (
    result.notablePerson !== null &&
    result.notablePerson.oldSlug !== path.toLowerCase()
  );
});
