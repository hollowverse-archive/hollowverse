import * as express from 'express';

const health = express();

health.get('/readiness_check', (_, res) => {
  res.status(200).send('OK');
});

health.get('/liveness_check', (_, res) => {
  res.status(200).send('OK');
});

export { health };
