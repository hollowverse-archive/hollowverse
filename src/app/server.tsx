import { Request, Response } from 'express';
import * as React from 'react';
import * as serializeJavaScript from 'serialize-javascript';
import { renderToString as render } from 'react-dom/server';
import { StaticRouter } from 'react-router';
import { Resolver } from 'react-resolver';
import { template } from 'lodash';
import { flushChunkNames } from 'react-universal-component/server';
import flushChunks from 'webpack-flush-chunks';
import * as loglevel from 'loglevel';
import { Stats } from 'webpack';

import { App } from './components/App';
import html from './index.html';

const interpolateTemplate = template(html);

const logger = loglevel.getLogger('SSR');
logger.setLevel(__DEBUG__ ? logger.levels.DEBUG : logger.levels.INFO);

export const createServerRenderMiddleware = ({
  clientStats,
}: {
  clientStats: Stats;
}) => async (req: Request, res: Response) => {
  try {
    const { Resolved, data } = await Resolver.resolve(() => {
      const context = {};

      return (
        <StaticRouter context={context} location={req.url}>
          <App />
        </StaticRouter>
      );
    });

    const app = render(<Resolved />);

    const chunkNames = flushChunkNames();

    const {
      js,
      styles,
      cssHash,
      scripts,
      stylesheets,
    } = flushChunks(clientStats, { chunkNames });

    logger.debug(`Request path: ${req.path}`);
    logger.debug('Dynamic chunk names rendered', chunkNames);
    logger.debug('Scripts served:', scripts);
    logger.debug('Stylesheets served:', stylesheets);

    res.send(
      interpolateTemplate({
        data: serializeJavaScript(data, {
          isJSON: true,
          space: __DEBUG__ ? 2 : 0,
        }),
        app,
        js,
        styles,
        cssHash,
      }),
    );
  } catch (e) {
    logger.error(e);
    res.status(500).send('Error');
  }
};