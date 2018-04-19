import express from 'express';
import httpProxyMiddleware from 'http-proxy-middleware';

import { appServer } from './appServer';
import { securityMiddleware } from './middleware/security';

export const mainServer = express();

mainServer.use(...securityMiddleware);

mainServer.use(appServer);

// Fallback to old hollowverse
mainServer.use(
  httpProxyMiddleware({
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
