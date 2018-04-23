import express, { RequestHandler } from 'express';
import path from 'path';
import moment from 'moment';
import { isNewSlug } from './isNewSlug';
import { redirectionMap, isWhitelistedPage } from 'redirectionMap';
import { clientDistDirectory } from 'webpack/variables';

const isProxyDisabled = Boolean(Number(process.env.NO_PROXY));

const serveNewAppPage: RequestHandler = (_req, res, _next) => {
  res.sendFile('index.html', {
    root: path.resolve(clientDistDirectory),
    maxAge: moment.duration(30, 'days').asMilliseconds(),

    // MUST NOT set the `immutable` directive to `true` because `index.html` filename
    // DOES NOT contain unique, content-based hash
    immutable: false,
  });
};

export const entryMiddleware = express();

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
