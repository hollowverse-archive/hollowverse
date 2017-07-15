import * as express from 'express';
import * as httpProxy from 'http-proxy';
import * as fs from 'fs';
import * as path from 'path';

const server = express();

// tslint:disable no-http-string no-suspicious-comment
// @TODO: replace 'http://hollowverse.com' with old server address
const OLD_SERVER_ADDRESS = process.env.OLD_SERVER || 'http://hollowverse.com';
const NEW_SERVER_ADDRESS = process.env.NEW_SERVER || 'http://localhost:3000';
// tslint:enable no-http-string no-suspicious-comment
const PUBLIC_PATH = path.resolve(
  process.cwd(),
  process.env.PUBLIC_PATH || 'public',
);
const PROXY_PORT = process.env.PROXY_PORT || 8080;

const proxyServer = httpProxy.createProxyServer();

const redirectionMap = new Map([['tom-hanks', 'Tom_Hanks']]);

const newPaths = new Set(redirectionMap.values());
const staticFiles = new Set(fs.readdirSync(PUBLIC_PATH));

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
  const redirectionPath = redirectionMap.get(reqPath);
  if (redirectionPath !== undefined) {
    // /tom-hanks => redirect to Tom_Hanks
    res.redirect(redirectionPath);
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
  proxyServer.web(req, res, { target: OLD_SERVER_ADDRESS }),
);

server.listen(PROXY_PORT);
