import 'regenerator-runtime/runtime';
import 'babel-polyfill';

import * as React from 'react';
import * as serializeJavaScript from 'serialize-javascript';
import { renderToString as render } from 'react-dom/server';
import { StaticRouter } from 'react-router';
import { flushChunkNames } from 'react-universal-component/server';

import flushChunks from 'webpack-flush-chunks';
import { App } from './components/App';
import { Resolver } from 'react-resolver';

import html from './index.html';

import template from 'lodash/template';

const compiledTemplate = template(html);

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
      compiledTemplate({
        data: serializeJavaScript(data, { isJSON: true }),
        app,
        js,
        styles,
        cssHash,
      }),
    );
  } catch (e) {
    console.error(e);
    res.status(500).send('Error');
  }
};
