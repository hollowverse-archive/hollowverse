// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
const functions = require('firebase-functions');

// The Firebase Admin SDK to access the Firebase Realtime Database.
const admin = require('firebase-admin');
const createCorsMiddleware = require('cors');

const cors = createCorsMiddleware({ origin: true });

admin.initializeApp(functions.config().firebase);

/**
 * A cloud function that fetchs data for a notable person by their slug.
 * The client should make a request to this function's URL with the slug as
 * a query.
 * @example `GET /fetchDataBySlug?slug=Tom_Hanks`
 */
exports.fetchDataBySlug = functions.https.onRequest((req, res) => {
  cors(req, res, () => {
    const slug = req.query.slug;

    return admin
      .database()
      .ref('/slugToID')
      .child(slug)
      .once('value')
      .then(r => r.val())
      .then(id =>
        admin
          .database()
          .ref('/notablePersons')
          .once('value')
          .then(snapshot => snapshot.child(id).val()),
      )
      .then(data => res.json(data));
  });
});
