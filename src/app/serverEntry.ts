// This will be transformed via babel-preset-env to individual
// polyfill requires as needed by targeted browsers
import '@babel/polyfill';
import { createServerRenderMiddleware } from 'server';

export { createServerRenderMiddleware } from './server';

// This must also be exported as a default export in order for
// `webpack-hot-server-middleware` to work correctly
// tslint:disable-next-line:no-default-export
export default createServerRenderMiddleware;
