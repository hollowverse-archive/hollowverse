import * as express from 'express';
import * as path from 'path';

const letsEncrypt = express();

const WELL_KNOWN_PATH = path.resolve(
  process.cwd(),
  process.env.WELL_KNOWN_PATH || './ssl/.well-known',
);

letsEncrypt.use((_, res, next) => {
  res.type('text/plain');
  next();
});

letsEncrypt.use(express.static(WELL_KNOWN_PATH, { dotfiles: 'allow' }));

letsEncrypt.use((_, res) => {
  res.status(404);
  res.send('Not Found');
});

export { letsEncrypt };
