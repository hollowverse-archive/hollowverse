import { Request, Response } from 'express';
import * as React from 'react';
import * as serializeJavaScript from 'serialize-javascript';
import { renderToString } from 'react-redux-epic';
import { ConnectedRouter } from 'react-router-redux';
import createMemoryHistory from 'history/createMemoryHistory';
import { template } from 'lodash';
import { flushChunkNames } from 'react-universal-component/server';
import flushChunks from 'webpack-flush-chunks';
import * as loglevel from 'loglevel';
import { Stats } from 'webpack';
import { Provider } from 'react-redux';
import { getStatusCode } from 'store/features/status/reducer';

import html from './index.server.html';
import { createStoreWithInitialState } from 'store/store';
import { App } from 'components/App/App';

const interpolateTemplate = template(html);

const logger = loglevel.getLogger('SSR');
logger.setLevel(__IS_DEBUG__ ? logger.levels.DEBUG : logger.levels.INFO);

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
  const history = createMemoryHistory({ initialEntries: [req.url] });
  const createNodeLogger = require('redux-node-logger');
  const { store, wrappedRootEpic } = createStoreWithInitialState(
    history,
    undefined,
    [createNodeLogger()],
  );

  renderToString(
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <App />
      </ConnectedRouter>
    </Provider>,
    wrappedRootEpic,
  ).subscribe({
    next({ markup }) {
      const chunkNames = flushChunkNames();

      const {
        js,
        styles,
        cssHash,
        scripts,
        stylesheets,
        publicPath,
      } = flushChunks(clientStats, { chunkNames });

      // logger.debug(`Request path: ${req.path}`);
      // logger.debug('Dynamic chunk names rendered', chunkNames);
      // logger.debug('Scripts served:', scripts);
      // logger.debug('Stylesheets served:', stylesheets);
      // logger.debug('Icon stats:', iconStats);
      // logger.debug('Public path:', publicPath);

      // Tell browsers to start fetching scripts and stylesheets as soon as they
      // parse the HTTP headers of the page
      res.setHeader(
        'Link',
        [
          ...stylesheets.map(
            src => `<${publicPath}/${src}>; rel=preload; as=style`,
          ),
          ...scripts.map(
            src => `<${publicPath}/${src}>; rel=preload; as=script`,
          ),
        ].join(','),
      );

      const icons = iconStats ? iconStats.html.join(' ') : '';

      const state = store.getState();
      logger.debug('Server-side Redux state:', state);

      res.status(getStatusCode(state) || 200);

      res.send(
        interpolateTemplate({
          // In order to protect from XSS attacks, make sure to use `serialize-javascript`
          // to serialize all data. `JSON.stringify` won't protect from XSS.
          // If `data` contains "</script><script>alert('Haha! Pwned!')</script>",
          // `JSON.stringify` won't help.
          // data: serializeJavaScript(data, {
          //   isJSON: true,
          //   space: __IS_DEBUG__ ? 2 : 0,
          // }),
          initialState: serializeJavaScript(state, {
            isJSON: true,
            space: __IS_DEBUG__ ? 2 : 0,
          }),
          markup,
          icons,
          js,
          styles,
          cssHash,
        }),
      );
    },

    complete() {
      logger.info('Request sent!');
    },

    error(error: Error) {
      logger.error(error);
      res.status(500).send('Error');
    },
  });
};
