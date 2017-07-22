import * as express from 'express';
import * as createCorsMiddleware from 'cors';

import { fetchNotablePersonBySlug } from './firebase';

const api = express();

const cors = createCorsMiddleware({ origin: true });

// Enable CORS for all API endpoints
api.use(cors);

// Set response type to application/json for all API endpoints
api.use((_, res, next) => {
  res.type('json');
  next();
});

api.get('/notablePersons/:slug', async (req, res, next) => {
  const { slug } = req.params;

  if (slug === undefined || slug.length === 0) {
    res.status(400);
    res.send({
      error:
        'Invalid request parameter. Make sure you pass `slug` in the query string',
    });
  }

  try {
    const data = await fetchNotablePersonBySlug(slug);
    if (data !== null) {
      res.send(data);
    } else {
      // Forward to the next non-error request handler
      next();
    }
  } catch (e) {
    res.status(500);
    next(e);
  }
});

api.use(
  // Non-error request handler
  (_, res, __) => {
    res.status(404);
    res.send({ error: 'Not Found' });
  },
);

// @NOTE: The array is used to trick TypeScript into inferring the right signature
api.use([
  // Error handler signature with 4 parameters
  (_, __, res, ___) => {
    res.status(500);
    res.send({ error: 'Server Error' });
  },
]);

export { api };
