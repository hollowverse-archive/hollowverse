import * as Express from 'express';
import * as path from 'path';

const app = Express();
const PORT = process.env.PORT || 3000;
const PUBLIC_PATH = process.env.PUBLIC_PATH || '../../public';

// This is fired every time the server side receives a request
app.use(Express.static(path.resolve(PUBLIC_PATH)));

app.get('*', (_, res) => {
  return res.sendFile(path.resolve(PUBLIC_PATH, 'index.html'));
});

app.listen(PORT);
