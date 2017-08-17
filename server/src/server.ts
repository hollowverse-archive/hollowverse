import * as express from 'express';

import { staticServer } from './staticServer/staticServer';

const app = express();

const PORT = process.env.STATIC_SERVER_PORT || 3000;

app.use(staticServer);

app.listen(PORT);
