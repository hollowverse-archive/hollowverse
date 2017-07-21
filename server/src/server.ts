import * as express from 'express';
import * as path from 'path';

import { api } from './api';

const app = express();

app.use('/api', api);

const PORT = process.env.STATIC_SEVER_PORT || 3000;
const PUBLIC_PATH = path.resolve(
  process.cwd(),
  process.env.PUBLIC_PATH || './public',
);

const indexFile = path.resolve(PUBLIC_PATH, 'index.html');

app.use(express.static(PUBLIC_PATH));

app.use((_, res) => res.sendFile(indexFile));

app.listen(PORT);
