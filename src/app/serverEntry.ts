// This will be transformed via babel-preset-env to individual
// polyfill requires as needed by targeted browsers
import '@babel/polyfill';

import { createServerEntryMiddleware } from './server';

export { createServerEntryMiddleware };

// This must also be exported as a default export in order for
// `webpack-hot-server-middleware` to work correctly
// tslint:disable-next-line:no-default-export
export default createServerEntryMiddleware;
