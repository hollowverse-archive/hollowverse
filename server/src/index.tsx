import * as express from 'express';
import * as path from 'path';

const app = express();

const PORT = process.env.PORT || 3000;
const PUBLIC_PATH = path.resolve(
  process.cwd(),
  process.env.PUBLIC_PATH || './public',
);

const indexFile = path.resolve(PUBLIC_PATH, 'index.html');

app.use(express.static(PUBLIC_PATH));

app.use((_, res) => res.sendFile(indexFile));

app.listen(PORT);
