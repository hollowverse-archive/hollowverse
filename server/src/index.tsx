import * as Express from 'express';
import * as path from 'path';

const app = Express();

const PORT = process.env.PORT || 3000;
const PUBLIC_PATH = process.env.PUBLIC_PATH
  ? path.resolve(process.cwd(), process.env.PUBLIC_PATH)
  : path.resolve(__dirname, '../../public');

app.get('/', (_, res) => {
  return res.sendFile(path.resolve(PUBLIC_PATH, 'index.html'));
});

app.use(Express.static(path.resolve(PUBLIC_PATH)));

app.listen(PORT);
