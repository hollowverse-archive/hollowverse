import 'regenerator-runtime/runtime';
import 'babel-polyfill';

import './globalStyles.scss';

import * as React from 'react';
import { renderToString as render } from 'react-dom/server';
import { StaticRouter } from 'react-router';
// import createHistory from 'history/createMemoryHistory';
import { flushChunkNames } from 'react-universal-component/server';
import { URL } from 'url';

declare var global: NodeJS.Global & { URL: typeof URL };

global.URL = URL;

import flushChunks from 'webpack-flush-chunks';
import { App } from './components/App';
import { Resolver } from 'react-resolver';

export default ({ clientStats }: any) => async (req: any, res: any) => {
  try {
    const { Resolved, data } = await Resolver.resolve(() => {
      const context = {};

      return (
        <StaticRouter context={context} location={req.url}>
          <App />
        </StaticRouter>
      );
    });

    console.log(data);

    const app = render(<Resolved />);

    const chunkNames = flushChunkNames();

    const {
      js,
      styles,
      cssHash,
      scripts,
      stylesheets,
    } = flushChunks(clientStats, { chunkNames });

    console.log('PATH', req.path);
    console.log('DYNAMIC CHUNK NAMES RENDERED', chunkNames);
    console.log('SCRIPTS SERVED', scripts);
    console.log('STYLESHEETS SERVED', stylesheets);

    res.send(
      `<!doctype html>
        <html>
          <head>
            <meta charset="utf-8">
            <title>react-universal-component-boilerplate</title>
            <style>
              #app {
                height: 100%;
                min-height: 100%;
              }
            </style>
            ${styles}
          </head>
          <body>
            <div id="app">${app}</div>
            ${cssHash}

            ${js}
          </body>
        </html>`,
    );
  } catch (e) {
    console.error(e);
    res.status(500).send(e);
  }
};
