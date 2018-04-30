import { APIGatewayProxyHandler } from 'aws-lambda'; // tslint:disable-line no-implicit-dependencies
import awsServerlessExpress from 'aws-serverless-express';
import httpProxyMiddleware from 'http-proxy-middleware';
import express from 'express';
import moment from 'moment';

import { clientDistDirectory, publicPath } from 'webpack/variables';
import { createRouter } from 'createRouter';
import { entryMiddleware } from 'entryMiddleware';

const expressApp = createRouter();

// Serve webpack build on /static/
// This must be defined before the entry middleware
expressApp.use(publicPath, [
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

// Serve actual website pages, e.g. /Tom_Hanks, /ray-j
// This will serve new pages and call the next middleware below
// for old website pages
expressApp.use(entryMiddleware);

// Fallback to old hollowverse
expressApp.use(
  httpProxyMiddleware({
    // tslint:disable-next-line no-http-string
    target: 'http://live.hollowverse.com',
    secure: false,
    changeOrigin: true,
    // Make sure all forwarded URLs end with / to avoid redirects
    onProxyReq(proxyReq: any) {
      if (
        !(proxyReq.path as string).endsWith('/') &&
        !(proxyReq.path as string).match(/\/.+\.[a-z]{2,4}$/gi)
      ) {
        /* eslint-disable no-param-reassign */
        proxyReq.path = `${proxyReq.path}/`;
      }
    },
  }),
);

const server = awsServerlessExpress.createServer(expressApp as any, undefined, [
  '*/*',
]);

export const servePages: APIGatewayProxyHandler = (event, context) => {
  awsServerlessExpress.proxy(server, event, context);
};
