// tslint:disable no-implicit-dependencies no-unsafe-any
import express from 'express';
import webpack from 'webpack';
import loglevel from 'loglevel';
import { once } from 'lodash';

import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import createProxyMiddleware from 'http-proxy-middleware';
import noFavIcons from 'express-no-favicons';
import webpackHotServerMiddleware from 'webpack-hot-server-middleware';
import clientConfig from './webpack/webpack.config.client';
import serverConfig from './webpack/webpack.config.server';

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
