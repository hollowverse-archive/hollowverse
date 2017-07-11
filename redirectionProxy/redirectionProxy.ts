import * as express from 'express';
import * as httpProxy from 'http-proxy';
import { URL } from 'url';

const server = express();

// tslint:disable-next-line no-http-string
const OLD_SERVER_ADDRESS = 'http://localhost:3000';

const proxyServer = httpProxy.createProxyServer({ target: OLD_SERVER_ADDRESS });

const redirectionMap = new Map<string, string>([['tom-hanks', 'Tom_Hanks']]);

server.get('/:oldUrl', (req, res) => {
  const oldSlug = req.params.oldUrl;
  const newSlug = redirectionMap.get(oldSlug);
  if (newSlug !== undefined) {
    const url = new URL(newSlug, 'https://hollowverse.com');
    res.redirect(url.toString());
  } else {
    proxyServer.web(req, res);
  }
});

server.listen(80);
