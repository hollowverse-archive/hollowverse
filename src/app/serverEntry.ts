// This will be transformed via babel-preset-env to individual
// polyfill requires as needed by targeted browsers
import '@babel/polyfill';

import { URL, URLSearchParams } from 'url';
import { createServerRenderMiddleware } from 'server';
import { performance } from 'perf_hooks';
import fetch from 'node-fetch';

declare var global: NodeJS.Global & {
  URL: typeof URL;
  URLSearchParams: typeof URLSearchParams;
  performance: typeof performance;
  fetch: typeof fetch;
};

global.URL = URL;
global.URLSearchParams = URLSearchParams;
global.performance = performance;
global.fetch = fetch;

export { createServerRenderMiddleware } from './server';

// This must also be exported as a default export in order for
// `webpack-hot-server-middleware` to work correctly
// tslint:disable-next-line:no-default-export
export default createServerRenderMiddleware;
