import * as express from 'express';
import * as bodyParser from 'body-parser';

import { isBodyValid } from '../logger/utils';
import { log } from '../logger/logger';

const logEndpoint = express();

logEndpoint.use(bodyParser.json());

// Set response type to application/json for all responses
logEndpoint.use((_, res, next) => {
  res.type('json');
  next();
});

logEndpoint.post('/', (req, res) => {
  const body = req.body;
  if (isBodyValid(body)) {
    log(body);
    res.status(201); // 201 Created
    res.send({});
  } else {
    res.status(400);
    res.send({ error: 'Invalid Body' });
  }
});

logEndpoint.use(
  // Non-error request handler
  (_, res, __) => {
    res.status(404);
    res.send({ error: 'Not Found' });
  },
);

// @NOTE: The array is used to trick TypeScript into inferring the right signature
logEndpoint.use([
  // Error handler signature with 4 parameters
  (_, __, res, ___) => {
    res.status(500);
    res.send({ error: 'Server Error' });
  },
]);

export { logEndpoint };
