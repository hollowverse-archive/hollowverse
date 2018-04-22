import express from 'express';
import httpProxyMiddleware from 'http-proxy-middleware';

import { serveStaticFiles } from './serveStaticFiles';
import { securityMiddleware } from './middleware/security';
// import { logEndpoint } from './logger/logEndpoint';

export const expressApp = express();

expressApp.use(...securityMiddleware);

expressApp.use(serveStaticFiles);

// expressApp.use('/log', logEndpoint);

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
        proxyReq.path = `${proxyReq.path}/`;
      }
    },
  }),
);
