import express from 'express';
import httpProxy from 'http-proxy';

// import { redirectToHttps } from './middleware/redirectToHttps';
import { appServer } from './appServer';
import { securityMiddleware } from './middleware/security';

const {
  OLD_SERVER_ADDRESS = 'https://static.legacy.hollowverse.com/',
} = process.env;

export const mainServer = express();

// server.use(redirectToHttps);

mainServer.use(...securityMiddleware);

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

mainServer.use(appServer);

// Fallback to old hollowverse
mainServer.use((req, res) => {
  proxyServer.web(req, res, {
    target: OLD_SERVER_ADDRESS,
    changeOrigin: true,
  });
});
