import * as express from 'express';
import * as httpProxy from 'http-proxy';
import * as fs from 'fs';
import * as path from 'path';

import { log } from './logger/logger';
import { logEndpoint } from './logger/logEndpoint';

const server = express();

const maxAge = 18000;

server.post('/enable-https', (_, res) => {
  res.setHeader('Strict-Transport-Security', `max-age=${maxAge}`);
  res.status(201).send('Created');
});

// tslint:disable no-http-string
const OLD_SERVER_ADDRESS =
  process.env.OLD_SERVER || 'http://dw5a6b9vjmt7w.cloudfront.net/';
const NEW_SERVER_ADDRESS = process.env.NEW_SERVER || 'http://localhost:3000/';
// tslint:enable no-http-string
const PUBLIC_PATH = path.resolve(
  process.cwd(),
  process.env.PUBLIC_PATH || './client/dist',
);
const PROXY_PORT = process.env.PORT || 8080;

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

const redirectionMap = new Map<string, string>([]);

const newPaths = new Set(redirectionMap.values());
const staticFiles = new Set(fs.readdirSync(PUBLIC_PATH));

/** Short-circuit the redirection proxy to expose the /log endpoint */
server.use('/log', logEndpoint);

/*
 * As the proxy is placed in front of the old version, we need to allow
 * requests to static assets to be directed to the new app.
 * The new proxy will check if the request is for a static file, and redirect accordingly.
 * As ":/path" matches routes on both new and old servers, the new proxy also has
 * to know  the new app paths to avoid redirection loops.
 */
server.get('/:path', (req, res, next) => {
  // '/:path' matches: /Tom_Hanks, /tom-hanks, /app.js, /michael-jackson, ashton-kutcher...
  const reqPath: string = req.params.path;

  log('PAGE_REQUESTED', { url: reqPath });

  const redirectionPath = redirectionMap.get(reqPath);
  if (redirectionPath !== undefined) {
    // /tom-hanks => redirect to Tom_Hanks
    res.redirect(`/${redirectionPath}`);
  } else if (newPaths.has(reqPath) || staticFiles.has(reqPath)) {
    // /Tom_Hanks, /app.js, /vendor.js => new hollowverse
    proxyServer.web(req, res, {
      target: NEW_SERVER_ADDRESS,
      changeOrigin: true,
    });
  } else {
    // /michael-jackson, ashton-kutcher, / => old hollowverse
    next();
  }
});

// Fallback to old hollowverse
server.use((req, res) =>
  proxyServer.web(req, res, {
    target: OLD_SERVER_ADDRESS,
    changeOrigin: true,
  }),
);

server.listen(PROXY_PORT);
