import { createServerRenderMiddleware } from 'createServerRenderMiddleware';
import { agent, Response } from 'supertest';
import {
  testRoutesMap,
  defaultTestDependencyOverrides,
  createMockGetResponseForDataRequest,
  defaultMockDataResponses,
} from 'helpers/testHelpers';
import express from 'express';
import cheerio from 'cheerio';
import { CreateServerMiddlewareOptions } from 'server';
import { ResolvedData } from 'store/types';

type CreateServerSideTestContextOptions = Partial<
  Pick<CreateServerMiddlewareOptions, 'epicDependenciesOverrides' | 'routesMap'>
> & {
  path: string;
  mockDataResponsesOverrides?: Partial<ResolvedData>;
};

export type ServerSideTestContext = {
  res: Response;
  $: CheerioStatic;
};

export const createServerSideTestContext = async ({
  path,
  routesMap = testRoutesMap,
  epicDependenciesOverrides = {},
  mockDataResponsesOverrides,
}: CreateServerSideTestContextOptions): Promise<ServerSideTestContext> => {
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
