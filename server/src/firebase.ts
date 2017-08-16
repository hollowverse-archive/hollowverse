import * as admin from 'firebase-admin';
import * as fs from 'fs';
import { NotablePersonSchema } from 'typings/dataSchema';

// Fetch the service account key JSON file contents
const SERVICE_ACCOUNT_KEY = JSON.parse(
  String(fs.readFileSync('gae-client-secret.json')),
);

admin.initializeApp({
  credential: admin.credential.cert(SERVICE_ACCOUNT_KEY),
  databaseURL: 'https://hollowverse-c9cad.firebaseio.com',
});

const db = admin.database();

/**
 * A helper function that fetches data for a notable person by their slug.
 * @example `fetchDataBySlug(Tom_Hanks)`
 */

export async function fetchNotablePersonBySlug(
  slug: string,
): Promise<NotablePersonSchema | null> {
  const id = (await db.ref('/slugToID').child(slug).once('value')).val();
  if (id === null) {
    return null;
  }
  const data = await db.ref('/notablePersons').child(id).once('value');

  return data.val();
}
