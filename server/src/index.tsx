import * as Express from 'express';
import * as path from 'path';

const app = Express();
const port = process.env.PORT || 3000;

// This is fired every time the server side receives a request
app.use(Express.static(path.resolve(__dirname, '../../public')));

app.get('*', (_, res) => {
  return res.sendFile(path.resolve(__dirname, '../../public/', 'index.html'));
});

app.listen(port);
