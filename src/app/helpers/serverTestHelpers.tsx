import { createServerRenderMiddleware } from 'createServerRenderMiddleware';
import { agent } from 'supertest';
import {
  defaultTestDependencyOverrides,
  createMockGetResponseForDataRequest,
  defaultMockDataResponses,
} from 'helpers/testHelpers';
import express from 'express';
import cheerio from 'cheerio';
import { CreateServerMiddlewareOptions } from 'server';
import { ResolvedData } from 'store/types';
import { routesMap as defaultRoutesMap } from 'routesMap';

type CreateServerSideTestContextOptions = Partial<
  Pick<CreateServerMiddlewareOptions, 'epicDependenciesOverrides' | 'routesMap'>
> & {
  path: string;
  mockDataResponsesOverrides?: Partial<ResolvedData>;
};

export const createServerSideTestContext = async ({
  path,
  routesMap = defaultRoutesMap,
  epicDependenciesOverrides = {},
  mockDataResponsesOverrides = {},
}: CreateServerSideTestContextOptions) => {
  const app = express();
  const ssrMiddleware = createServerRenderMiddleware({
    epicDependenciesOverrides: {
      ...defaultTestDependencyOverrides,
      ...epicDependenciesOverrides,
      getResponseForDataRequest: jest.fn(
        epicDependenciesOverrides.getResponseForDataRequest
          ? epicDependenciesOverrides.getResponseForDataRequest
          : createMockGetResponseForDataRequest({
              ...defaultMockDataResponses,
              ...mockDataResponsesOverrides,
            }),
      ),
    },
    routesMap,
  });

  app.use(ssrMiddleware);

  const res = await agent(app)
    .get(path)
    .accept('text/html');

  const $ = cheerio.load(res.text);

  return { res, $ };
};

export type ServerSideTestContext = UnboxPromise<
  ReturnType<typeof createServerSideTestContext>
>;
