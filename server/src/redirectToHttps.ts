import * as express from 'express';
import { URL } from 'url';

const redirectToHttps = express();

redirectToHttps.use((req, res, next) => {
  const protocol = req.header('X-FORWARDED-PROTO');
  const host = req.header('Host') || 'api.hollowverse.com';
  if (protocol === 'http') {
    const newURL = new URL(req.url, `https://${host}`);
    res.redirect(newURL.toString());
  } else {
    next();
  }
});

export { redirectToHttps };
