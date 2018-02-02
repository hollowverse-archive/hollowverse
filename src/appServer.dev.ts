// tslint:disable no-implicit-dependencies
import * as express from 'express';
import * as webpack from 'webpack';
import * as loglevel from 'loglevel';
import { once } from 'lodash';

import * as webpackDevMiddleware from 'webpack-dev-middleware';
import * as webpackHotMiddleware from 'webpack-hot-middleware';
import * as createProxyMiddleware from 'http-proxy-middleware';
import * as noFavIcons from 'express-no-favicons';
// tslint:disable-next-line:no-require-imports
import webpackHotServerMiddleware = require('webpack-hot-server-middleware');
import * as clientConfig from './webpack/webpack.config.client';
import * as serverConfig from './webpack/webpack.config.server';

const appServer = express();

const { APP_SERVER_PORT = 3001 } = process.env;
const logger = loglevel.getLogger('Web App Server');

logger.setLevel(logger.levels.INFO);

const startServer = () => {
  appServer.listen(APP_SERVER_PORT, () => {
    logger.info(`App server is listening on port ${APP_SERVER_PORT}`);
  });
};

logger.info('Starting webpack compilation...');

const compiler = webpack([clientConfig, serverConfig]);

// @ts-ignore
const clientCompiler = compiler.compilers[0];
const options = serverConfig.devServer;

appServer.use(
  '/__api',
  createProxyMiddleware({
    target: process.env.API_ENDPOINT,
    secure: false,
  }),
);

appServer.use(noFavIcons());
appServer.use(webpackDevMiddleware(compiler, options));
appServer.use(webpackHotMiddleware(clientCompiler));

appServer.use(webpackHotServerMiddleware(compiler));

// `done` will fire multiple times, on every code change, but
// `startServer` should only be called once after the first
// compilation is finished
compiler.plugin('done', once(startServer));
