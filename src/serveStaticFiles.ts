import express from 'express';
import loglevel from 'loglevel';
import moment from 'moment';

import { securityMiddleware } from './middleware/security';
import { clientDistDirectory, publicPath } from './webpack/variables';

const logger = loglevel.getLogger('Web App Server');

logger.setLevel(logger.levels.INFO);

export const serveStaticFiles = express();

serveStaticFiles.use(...securityMiddleware);

// Serve client build like usual
// This must be defined before the SSR middleware so that
// requests to static files, e.g. /static/app.js, are not
// processed by the server rendering middleware below
serveStaticFiles.use(publicPath, [
  // Configure Cache-Control header
  express.static(clientDistDirectory, {
    maxAge: moment.duration(30, 'days').asMilliseconds(),

    // Safe to use the `immutable` directive because filenames
    // contain unique, content-based hashes
    immutable: true,

    // Send index.html when requesting /
    index: true,
  }),
]);
