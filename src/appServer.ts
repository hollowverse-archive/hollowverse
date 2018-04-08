import path from 'path';
import express from 'express';
import loglevel from 'loglevel';
import moment from 'moment';

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

// Serve client build like usual
// This must be defined before the SSR middleware so that
// requests to static files, e.g. /static/app.js, are not
// processed by the server rendering middleware below
appServer.use(publicPath, [
  // Configure Cache-Control header
  express.static(clientDistDirectory, {
    maxAge: moment.duration(30, 'days').asMilliseconds(),

    // Safe to use the `immutable` directive because filenames
    // contain unique, content-based hashes
    immutable: true,

    // Do not send index.html when requesting /
    index: false,
  }),
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
