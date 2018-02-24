import { createServerRenderMiddleware } from 'createServerRenderMiddleware';
import { agent, Response } from 'supertest';
import {
  testRoutesMap,
  defaultTestDependencyOverrides,
} from 'helpers/testHelpers';
import express from 'express';
import { promisify } from 'util';
import fs from 'fs';
import { join } from 'path';
import cheerio from 'cheerio';
import { Stats } from 'webpack';
import { CreateServerMiddlewareOptions } from 'server';

const readFile = promisify(fs.readFile);

const clientStats = readFile(
  join(__dirname, '../bundle/stats.json'),
  'utf8',
).then(JSON.parse) as Promise<Stats>;

type CreateServerSideTestContextOptions = Partial<
  Pick<CreateServerMiddlewareOptions, 'epicDependenciesOverrides' | 'routesMap'>
> & {
  path: string;
};

export type ServerSideTestContext = {
  res: Response;
  $: CheerioStatic;
};

export const createServerSideTestContext = async ({
  path,
  routesMap = testRoutesMap,
  epicDependenciesOverrides = {},
}: CreateServerSideTestContextOptions): Promise<ServerSideTestContext> => {
  const app = express();
  const ssrMiddleware = createServerRenderMiddleware({
    clientStats: await clientStats,
    epicDependenciesOverrides: {
      ...defaultTestDependencyOverrides,
      ...epicDependenciesOverrides,
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
