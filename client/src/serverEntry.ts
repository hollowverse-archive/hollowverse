import { URL } from 'url';

declare var global: NodeJS.Global & { URL: typeof URL };

global.URL = URL;

import serverRender from './server';

export default serverRender;
