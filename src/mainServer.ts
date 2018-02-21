// tslint:disable no-unsafe-any
import express from 'express';
import httpProxy from 'http-proxy';

import { redirectToHttps } from './middleware/redirectToHttps';
import { appServer } from './appServer';
import { securityMiddleware } from './middleware/security';

const {
  OLD_SERVER_ADDRESS = 'https://static.legacy.hollowverse.com/',
  PORT = 8080,
} = process.env;

const server = express();

server.use(redirectToHttps);

server.use(...securityMiddleware);

const proxyServer = httpProxy.createProxyServer();

// Make sure all forwarded URLs end with / to avoid redirects
proxyServer.on('proxyReq', (proxyReq: any) => {
  if (
    !(proxyReq.path as string).endsWith('/') &&
    !(proxyReq.path as string).match(/\/.+\.[a-z]{2,4}$/gi)
  ) {
    proxyReq.path = `${proxyReq.path}/`;
  }
});

server.use(appServer);

// Fallback to old hollowverse
server.use((req, res) => {
  proxyServer.web(req, res, {
    target: OLD_SERVER_ADDRESS,
    changeOrigin: true,
  });
});

server.listen(PORT);
