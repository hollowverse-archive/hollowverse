import { NotablePersonSchema } from 'typings/dataSchema';
import { API_BASE } from 'constants/api';

export async function fetchNotablePersonDataBySlug(
  slug: string,
): Promise<NotablePersonSchema> {
  const url = new URL(`/api/notablePersons/${slug}`, API_BASE);

  const data = await fetch(url.toString());

  return data.json();
}
