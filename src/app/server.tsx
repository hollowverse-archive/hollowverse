import express from 'express';
import * as React from 'react';
import { HelmetProvider, FilledContext } from 'react-helmet-async';
import * as serializeJavaScript from 'serialize-javascript';
import { renderToString, wrapRootEpic } from 'react-redux-epic';
import { ConnectedRouter } from 'react-router-redux';
import createMemoryHistory from 'history/createMemoryHistory';
import { template, mapValues } from 'lodash';
import { flushChunkNames } from 'react-universal-component/server';
import flushChunks from 'webpack-flush-chunks';

import * as loglevel from 'loglevel';

import { Stats } from 'webpack';

import {
  getStatusCode,
  getRedirectionUrl,
} from 'store/features/status/reducer';

import { Provider } from 'react-redux';
import { createConfiguredStore } from 'store/createConfiguredStore';
import { App } from 'components/App/App';
import html from './index.server.html';

const interpolateTemplate = template(html);

const logger = loglevel.getLogger('SSR');
logger.setLevel(__IS_DEBUG__ ? logger.levels.DEBUG : logger.levels.INFO);

type IconStats = {
  outputFilePrefix: string;
  html: string[];
  files: string[];
};

import { logEndpoint } from './logger/logEndpoint';
import { redirectionMap, whitelistedNewPaths } from './redirectionMap';
import { isNewSlug } from './isNewSlug';
import { RequestHandler } from 'express-serve-static-core';

export const createServerRenderMiddleware = ({
  clientStats,
  iconStats,
}: {
  clientStats: Stats;
  iconStats: IconStats | undefined;
}) => {
  // tslint:disable-next-line:max-func-body-length
  const serverRenderMiddleware: RequestHandler = async (req, res) => {
    const start = Date.now();
    const history = createMemoryHistory({ initialEntries: [req.url] });
    const { store, wrappedRootEpic } = createConfiguredStore(
      history,
      undefined,
      wrapRootEpic,
    );

    const helmetContext = {};

    renderToString(
      <HelmetProvider context={helmetContext}>
        <Provider store={store}>
          <ConnectedRouter history={history}>
            <App />
          </ConnectedRouter>
        </Provider>
      </HelmetProvider>,
      wrappedRootEpic,
    ).subscribe({
      next({ markup }) {
        const state = store.getState();
        logger.debug('Server-side Redux state:', state);

        const statusCode = getStatusCode(state) || 200;
        res.status(statusCode);

        if (statusCode === 301 || statusCode === 302) {
          const url = getRedirectionUrl(state) as string;
          res.redirect(url);
        } else {
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
          logger.debug('Icon stats:', iconStats);
          logger.debug('Public path:', publicPath);

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

          const { title, meta, link, htmlAttributes } = mapValues(
            (helmetContext as FilledContext).helmet,
            String,
          );

          res.send(
            interpolateTemplate({
              // In order to protect from XSS attacks, make sure to use `serialize-javascript`
              // to serialize all data. `JSON.stringify` won't protect from XSS.
              // If `data` contains "</script><script>alert('Haha! Pwned!')</script>",
              // `JSON.stringify` won't help.
              initialState: serializeJavaScript(state, {
                isJSON: true,
                space: __IS_DEBUG__ ? 2 : 0,
              }),
              markup,
              icons,
              js,
              styles,
              cssHash,
              htmlAttributes,
              link,
              title,
              meta,
            }),
          );
        }
      },

      complete() {
        const end = Date.now();
        logger.debug(`Request took ${end - start}ms to process`);
      },

      error(error: Error) {
        logger.error(error);
        res.status(500).send('Error');
      },
    });
  };

  const entryMiddleware = express();

  entryMiddleware.use('/log', logEndpoint);

  entryMiddleware.use(async (req, res, next) => {
    try {
      // `req.url` matches: /Tom_Hanks, /tom-hanks, /app.js, /michael-jackson, ashton-kutcher...
      const path: string = req.url.replace('/', '');
      const redirectionPath = redirectionMap.get(path);
      if (redirectionPath !== undefined) {
        // /tom-hanks => redirect to Tom_Hanks
        res.redirect(`/${redirectionPath}`);
      } else if (whitelistedNewPaths.has(path) || (await isNewSlug(path))) {
        serverRenderMiddleware(req, res, next);
      } else {
        next();
      }
    } catch (e) {
      console.error(e);
      next();
    }
  });

  return entryMiddleware;
};
