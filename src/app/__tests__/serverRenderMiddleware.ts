import { createServerRenderMiddleware } from 'createServerRenderMiddleware';
import supertest from 'supertest';
import {
  defaultTestDependencyOverrides,
  testRoutesMap,
} from 'helpers/testHelpers';
import express from 'express';

describe('Server rendering middleware', () => {
  it('works', async () => {
    const app = express();
    const ssrMiddleware = createServerRenderMiddleware({
      // @ts-ignore
      clientStats: __non_webpack_require__('.././bundle/stats.json'),
      epicDependenciesOverrides: defaultTestDependencyOverrides,
      routesMap: testRoutesMap,
    });

    app.use(ssrMiddleware);

    const res = await supertest(app).get('/');

    expect(res.status).toBe(200);
    expect(res.body).toBeDefined();
  });
});
