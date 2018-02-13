// tslint:disable no-unsafe-any
import * as path from 'path';
import * as express from 'express';
import * as loglevel from 'loglevel';
import * as moment from 'moment';
import * as shrinkRay from 'shrink-ray';

import { securityMiddleware } from './middleware/security';
import {
  clientDistDirectory,
  serverDistDirectory,
  publicPath,
} from './webpack/variables';

const logger = loglevel.getLogger('Web App Server');

logger.setLevel(logger.levels.INFO);

export const appServer = express();

appServer.use(...securityMiddleware);

const removeSetCookieHeader: express.RequestHandler = (_, res, next) => {
  res.removeHeader('Set-Cookie');
  next();
};

// Serve client build like usual
// This must be defined before the SSR middleware so that
// requests to static files, e.g. /static/app.js, are not
// processed by the server rendering middleware below
appServer.use(publicPath, [
  // Enable gzip and brotli compression
  shrinkRay(),

  // Configure Cache-Control header
  express.static(clientDistDirectory, {
    maxAge: moment.duration(30, 'days').asMilliseconds(),

    // Safe to use the `immutable` directive because filenames
    // contain unique, content-based hashes
    immutable: true,

    // Do not send index.html when requesting /
    index: false,
  }),

  // When a response is cached with `Cache-Control: immutable` (see above), 
  // the browser will not even send a request to check if the resource 
  // has been updated. So if for example the user was on the `new-app` branch
  // and they are switched to `master`, and if both branches has shared assets, the 
  // browser will re-use the assets previously cached for `new-app`.
  //
  // Since the responses for these assets had `Set-Cookie: branch=new-app`,
  // the environment which was just routed to `master` will be set again to
  // `branch=new-app` when the asset is read from disk. So immutable caching
  // is causing the environment to be reset again to the branch that the user
  // was on when he first requested that asset.
  // We should _not_ set the `Set-Cookie` header on static assets.

  // See https://github.com/hollowverse/hollowverse/issues/287
  removeSetCookieHeader,
]);

// tslint:disable no-require-imports no-var-requires non-literal-require
const { default: createServerEntryMiddleware } = require(path.resolve(
  serverDistDirectory,
  'main.js',
));

let iconStats;
try {
  iconStats = require(path.resolve(clientDistDirectory, 'iconStats.json'));
} catch (e) {
  iconStats = undefined;
}

const stats = require('./stats.json');

const clientStats = stats.children[0];

appServer.use(createServerEntryMiddleware({ clientStats, iconStats }));
