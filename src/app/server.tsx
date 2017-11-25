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

import { App } from './components/App/App';
import html from './index.server.html';

const interpolateTemplate = template(html);

const logger = loglevel.getLogger('SSR');
logger.setLevel(__DEBUG__ ? logger.levels.DEBUG : logger.levels.INFO);

type IconStats = {
  outputFilePrefix: string;
  html: string[];
  files: string[];
};

export const createServerRenderMiddleware = ({
  clientStats,
  iconStats,
}: {
  clientStats: Stats;
  iconStats: IconStats | undefined;
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
      publicPath,
    } = flushChunks(clientStats, { chunkNames });

    logger.debug(`Request path: ${req.path}`);
    logger.debug('Dynamic chunk names rendered', chunkNames);
    logger.debug('Scripts served:', scripts);
    logger.debug('Stylesheets served:', stylesheets);
    logger.debug('icon stats:', iconStats);
    logger.debug('Public path:', publicPath);

    // Tell browsers to start fetching scripts and stylesheets as soon as they
    // parse the HTTP headers of the page
    res.setHeader(
      'Link',
      [
        ...stylesheets.map(
          src => `<${publicPath}/${src}>; rel=preload; as=style`,
        ),
        ...scripts.map(src => `<${publicPath}/${src}>; rel=preload; as=script`),
      ].join(','),
    );

    const icons = iconStats ? iconStats.html.join(' ') : '';

    res.send(
      interpolateTemplate({
        // In order to protect from XSS attacks, make sure to use `serialize-javascript`
        // to serialize all data. `JSON.stringify` won't protect from XSS.
        // If `data` contains "</script><script>alert('Haha! Pwned!')</script>",
        // `JSON.stringify` won't help.
        data: serializeJavaScript(data, {
          isJSON: true,
          space: __DEBUG__ ? 2 : 0,
        }),
        app,
        icons,
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
