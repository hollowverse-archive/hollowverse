import { URL, URLSearchParams } from 'url';
import { createServerRenderMiddleware } from 'server';

declare var global: NodeJS.Global & {
  URL: typeof URL;
  URLSearchParams: typeof URLSearchParams;
};

global.URL = URL;
global.URLSearchParams = URLSearchParams;

export { createServerRenderMiddleware } from './server';

// This must also be exported as a default export in order for
// `webpack-hot-server-middleware` to work correctly
// tslint:disable-next-line:no-default-export
export default createServerRenderMiddleware;
