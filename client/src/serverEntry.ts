import { URL } from 'url';

declare var global: NodeJS.Global & { URL: typeof URL };

global.URL = URL;

export { createServerRenderMiddleware } from './server';
