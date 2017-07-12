// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
import * as functions from 'firebase-functions';

// The Firebase Admin SDK to access the Firebase Realtime Database.
import * as admin from 'firebase-admin';
import * as createCorsMiddleware from 'cors';

admin.initializeApp(functions.config().firebase);

const db = admin.database();
const cors = createCorsMiddleware({ origin: true });

/**
 * A cloud function that fetches data for a notable person by their slug.
 * The client should make a request to this function's URL with the slug as
 * a query.
 * @example `GET /fetchDataBySlug?slug=Tom_Hanks`
 */
export const fetchDataBySlug = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    const slug = req.query.slug;

    const id = (await db.ref('/slugToID').child(slug).once('value')).val();
    const data = (await db
      .ref('/notablePersons')
      .child(id)
      .once('value')).val();

    return res.json(data);
  });
});
