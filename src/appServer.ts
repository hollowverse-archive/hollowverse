import * as path from 'path';
import * as express from 'express';
import * as loglevel from 'loglevel';
import { once } from 'lodash';
import * as moment from 'moment';
import * as shrinkRay from 'shrink-ray';

import { securityMiddleware } from './middleware/security';
import { isProd } from './webpack/env';
import {
  clientDistDirectory,
  serverDistDirectory,
  publicPath,
} from './webpack/variables';

const logger = loglevel.getLogger('Web App Server');

const { APP_SERVER_PORT = 3001 } = process.env;

logger.setLevel(logger.levels.INFO);

const appServer = express();

appServer.use(...securityMiddleware);

if (isProd) {
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
  ]);

  // Serve server rendering middleware from the SSR build
  // tslint:disable no-require-imports no-var-requires non-literal-require
  const { createServerRenderMiddleware } = require(path.join(
    serverDistDirectory,
    'main.js',
  ));

  let iconStats;
  try {
    iconStats = require(path.join(clientDistDirectory, 'iconStats.json'));
  } catch (e) {
    iconStats = undefined;
  }

  const stats = require('./stats.json');
  // tslint:enable no-require-imports no-var-requires

  const clientStats = stats.children[0];
  appServer.use(createServerRenderMiddleware({ clientStats, iconStats }));
} else {
  const startServer = () => {
    appServer.listen(APP_SERVER_PORT, () => {
      logger.info(`App server is listening on port ${APP_SERVER_PORT}`);
    });
  };

  // tslint:disable no-require-imports no-var-requires no-implicit-dependencies
  const webpack = require('webpack');
  const webpackDevMiddleware = require('webpack-dev-middleware');
  const webpackHotMiddleware = require('webpack-hot-middleware');
  const webpackHotServerMiddleware = require('webpack-hot-server-middleware');
  // tslint:enable no-implicit-dependencies
  const clientConfig = require('./webpack/webpack.config.client');
  const serverConfig = require('./webpack/webpack.config.server');
  // tslint:enable no-require-imports no-var-requires no-implicit-dependencies

  logger.info('Starting webpack compilation...');

  const compiler = webpack([clientConfig, serverConfig]);

  // @ts-ignore
  const clientCompiler = compiler.compilers[0];
  const options = { publicPath, stats: { colors: true } };

  appServer.use(webpackDevMiddleware(compiler, options));
  appServer.use(webpackHotMiddleware(clientCompiler));

  // @ts-ignore
  appServer.use(webpackHotServerMiddleware(compiler));

  // `done` will fire multiple times, on every code change, but
  // `startServer` should only be called once after the first
  // compilation is finished
  compiler.plugin('done', once(startServer));
}

export { appServer };
