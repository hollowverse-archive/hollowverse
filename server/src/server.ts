import * as express from 'express';

import { staticServer } from './staticServer/staticServer';

const app = express();

const PORT = process.env.STATIC_SEVER_PORT || 3000;

app.use(staticServer);

app.listen(PORT);
