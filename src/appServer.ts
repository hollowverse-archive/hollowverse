import * as express from 'express';
import * as noFavicon from 'express-no-favicons';
import * as loglevel from 'loglevel';
import { once } from 'lodash';

import * as clientConfig from './webpack/webpack.config.client';
import * as serverConfig from './webpack/webpack.config.server';
import { isProd } from './webpack/env';

const logger = loglevel.getLogger('Web App Server');

const { publicPath, path: distDirectory } = clientConfig.output;

const { APP_SERVER_PORT = 3001 } = process.env;

logger.setLevel(logger.levels.INFO);

const app = express();

// Ignore requests for favicons
app.use(noFavicon());

const startServer = () => {
  app.listen(APP_SERVER_PORT, () => {
    logger.info(`App server is listening on port ${APP_SERVER_PORT}`);
  });
};

if (isProd) {
  // Serve client build like usual
  // This must be defined before the SSR middleware so that
  // requests to static files, e.g. /static/app.js, are not
  // processed by the server rendering middleware below
  app.use(publicPath, express.static(distDirectory));

  // Serve server rendering middleware from the SSR build
  // tslint:disable no-require-imports no-var-requires
  const { createServerRenderMiddleware } = require('./app/main.js');
  const stats = require('./stats.json');
  // tslint:enable no-require-imports no-var-requires

  const clientStats = stats.children[0];
  app.use(createServerRenderMiddleware({ clientStats }));

  startServer();
} else {
  // tslint:disable no-require-imports no-var-requires no-implicit-dependencies
  const webpack = require('webpack');
  const webpackDevMiddleware = require('webpack-dev-middleware');
  const webpackHotMiddleware = require('webpack-hot-middleware');
  const webpackHotServerMiddleware = require('webpack-hot-server-middleware');
  // tslint:enable no-require-imports no-var-requires no-implicit-dependencies

  const compiler = webpack([clientConfig, serverConfig]);

  // @ts-ignore
  const clientCompiler = compiler.compilers[0];
  const options = { publicPath, stats: { colors: true } };

  app.use(webpackDevMiddleware(compiler, options));
  app.use(webpackHotMiddleware(clientCompiler));

  // @ts-ignore
  app.use(webpackHotServerMiddleware(compiler));

  // `done` will fire multiple times, on every code change, but
  // `startServer` should only be called once after the first
  // compilation is finished
  compiler.plugin('done', once(startServer));
}
