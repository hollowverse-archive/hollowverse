import express, { RequestHandler } from 'express';
import path from 'path';

import { Stats } from 'webpack';

import { logEndpoint } from './logger/logEndpoint';
import { redirectionMap, isWhitelistedPage } from './redirectionMap';
import { isNewSlug } from './isNewSlug';
import { createServerRenderMiddleware } from 'createServerRenderMiddleware';
import moment from 'moment';
import { CreateConfiguredStoreOptions } from 'store/createConfiguredStore';
import { AppRoutesMap } from 'components/App/App';

type IconStats = {
  outputFilePrefix: string;
  html: string[];
  files: string[];
};

export type CreateServerMiddlewareOptions = {
  clientStats: Stats;
  epicDependenciesOverrides: CreateConfiguredStoreOptions['epicDependenciesOverrides'];
  iconStats?: IconStats;
  routesMap: AppRoutesMap;
};

const isSsrDisabled = Boolean(Number(process.env.NO_SSR));
const isProxyDisabled = Boolean(Number(process.env.NO_PROXY));

export const createServerEntryMiddleware = (
  options: CreateServerMiddlewareOptions,
) => {
  const renderOnServer = createServerRenderMiddleware(options);

  const renderOnClient: RequestHandler = (_, res) => {
    res.sendFile('index.html', {
      root: path.resolve(process.cwd(), 'dist/client'),
      maxAge: moment.duration(30, 'days').asMilliseconds(),

      // MUST NOT set the `immutable` directive to `true` because `index.html` filename
      // DOES NOT contain unique, content-based hash
      immutable: false,
    });
  };

  const renderNewAppPage = isSsrDisabled ? renderOnClient : renderOnServer;
  const serveNewAppPage: RequestHandler = (req, res, next) => {
    // Tell browsers not to use cached pages if the commit ID of the environment differs
    res.vary('X-Hollowverse-Actual-Environment-Commit-ID');

    renderNewAppPage(req, res, next);
  };

  const entryMiddleware = express();

  // Add version details to custom header
  if (__BRANCH__ && __COMMIT_ID__) {
    entryMiddleware.use((_, res, next) => {
      res.setHeader('X-Hollowverse-Actual-Environment-Branch', __BRANCH__);

      res.setHeader(
        'X-Hollowverse-Actual-Environment-Commit-ID',
        __COMMIT_ID__,
      );
      next();
    });
  }

  entryMiddleware.use('/log', logEndpoint);

  entryMiddleware.use(async (req, res, next) => {
    try {
      // `req.url` matches: /Tom_Hanks, /tom-hanks, /app.js, /michael-jackson, ashton-kutcher...
      const requestPath = decodeURI(req.path.replace(/\/$/g, ''));
      const redirectionPath = redirectionMap.get(requestPath);
      if (redirectionPath !== undefined) {
        // /tom-hanks => redirect to Tom_Hanks
        res.redirect(redirectionPath);
      } else if (
        isProxyDisabled ||
        isWhitelistedPage(requestPath) ||
        (await isNewSlug(requestPath.replace('/', '')))
      ) {
        serveNewAppPage(req, res, next);
      } else {
        next();
      }
    } catch (e) {
      console.error(e);
      next();
    }
  });

  entryMiddleware.disable('x-powered-by');

  return entryMiddleware;
};
