import { URL } from 'url';
import { createServerRenderMiddleware } from 'server';

declare var global: NodeJS.Global & { URL: typeof URL };

global.URL = URL;

export { createServerRenderMiddleware } from './server';

// This must also be exported as a default export in order for
// `webpack-hot-server-middleware` to work correctly
// tslint:disable-next-line:no-default-export
export default createServerRenderMiddleware;
