import { createServerRenderMiddleware } from 'createServerRenderMiddleware';
import { agent, Response } from 'supertest';
import {
  testRoutesMap,
  defaultTestDependencyOverrides,
  createMockGetResponseForDataRequest,
  defaultMockDataResponses,
} from 'helpers/testHelpers';
import express from 'express';
import { promisify } from 'util';
import fs from 'fs';
import { join } from 'path';
import cheerio from 'cheerio';
import { Stats } from 'webpack';
import { CreateServerMiddlewareOptions } from 'server';
import { ResolvedData } from 'store/types';

const readFile = promisify(fs.readFile);

const clientStats = readFile(
  join(__dirname, '../bundle/stats.json'),
  'utf8',
).then(JSON.parse) as Promise<Stats>;

type CreateServerSideTestContextOptions = Partial<
  Pick<CreateServerMiddlewareOptions, 'epicDependenciesOverrides' | 'routesMap'>
> & {
  path: string;
  mockDataResponsesOverrides: Partial<ResolvedData>;
};

export type ServerSideTestContext = {
  res: Response;
  $: CheerioStatic;
};

export const createServerSideTestContext = async ({
  path,
  routesMap = testRoutesMap,
  epicDependenciesOverrides = {},
  mockDataResponsesOverrides = {},
}: CreateServerSideTestContextOptions): Promise<ServerSideTestContext> => {
  const app = express();
  const ssrMiddleware = createServerRenderMiddleware({
    clientStats: await clientStats,
    epicDependenciesOverrides: {
      ...defaultTestDependencyOverrides,
      ...epicDependenciesOverrides,
      getResponseForDataRequest: jest.fn(
        createMockGetResponseForDataRequest({
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
