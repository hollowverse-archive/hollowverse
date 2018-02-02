import express, { RequestHandler } from 'express';
import * as path from 'path';

import { Stats } from 'webpack';

import { logEndpoint } from './logger/logEndpoint';
import { redirectionMap, isWhitelistedPage } from './redirectionMap';
import { isNewSlug } from './isNewSlug';
import { createServerRenderMiddleware } from 'createServerRenderMiddleware';

type IconStats = {
  outputFilePrefix: string;
  html: string[];
  files: string[];
};

export type CreateMiddlewareOptions = {
  clientStats: Stats;
  iconStats: IconStats | undefined;
};

const isSsrDisabled = process.env.NO_SSR;

export const createServerEntryMiddleware = (
  options: CreateMiddlewareOptions,
) => {
  const renderOnServer = createServerRenderMiddleware(options);

  const renderOnClient: RequestHandler = (_, res) => {
    res.sendFile(path.resolve(__dirname, 'index.html'));
  };

  const serveNewApp: RequestHandler = (req, res, next) => {
    if (isSsrDisabled) {
      renderOnClient(req, res, next);
    } else {
      renderOnServer(req, res, next);
    }
  };

  const entryMiddleware = express();

  entryMiddleware.use('/log', logEndpoint);

  entryMiddleware.use(async (req, res, next) => {
    try {
      // `req.url` matches: /Tom_Hanks, /tom-hanks, /app.js, /michael-jackson, ashton-kutcher...
      const requestPath = req.path.replace(/\/$/g, '');
      const redirectionPath = redirectionMap.get(requestPath);
      if (redirectionPath !== undefined) {
        // /tom-hanks => redirect to Tom_Hanks
        res.redirect(redirectionPath);
      } else if (
        isWhitelistedPage(requestPath) ||
        (await isNewSlug(requestPath.replace('/', '')))
      ) {
        serveNewApp(req, res, next);
      } else {
        next();
      }
    } catch (e) {
      console.error(e);
      next();
    }
  });

  return entryMiddleware;
};
