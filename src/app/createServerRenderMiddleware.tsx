import { RequestHandler } from 'express';
import React from 'react';
import { HelmetProvider, PopulatedContext } from 'react-helmet-async';
import serializeJavaScript from 'serialize-javascript';
import { renderToString, wrapRootEpic } from 'react-redux-epic';
import { ConnectedRouter } from 'react-router-redux';
import createMemoryHistory from 'history/createMemoryHistory';
import { template, mapValues } from 'lodash';
import { ReportChunks } from 'react-universal-component';
import flushChunks from 'webpack-flush-chunks';
import 'rxjs/add/operator/toPromise';

import loglevel from 'loglevel';

import {
  getStatusCode,
  getRedirectionUrl,
} from 'store/features/status/reducer';

import { Provider } from 'react-redux';
import { createConfiguredStore } from 'store/createConfiguredStore';
import { App } from 'components/App/App';
import html from './index.server.html';

import { CreateServerMiddlewareOptions } from './server';
import {
  defaultAppDependencies,
  AppDependenciesContext,
} from 'appDependenciesContext';
import { createGetUniqueId } from 'helpers/createGetUniqueId';
import { routesMap as defaultRoutesMap } from 'routesMap';

const interpolateTemplate = template(html);

const logger = loglevel.getLogger('SSR');
logger.setLevel(__IS_DEBUG__ ? logger.levels.DEBUG : logger.levels.INFO);

// tslint:disable:max-func-body-length
export const createServerRenderMiddleware = ({
  clientStats,
  iconStats,
  epicDependenciesOverrides,
  routesMap = defaultRoutesMap,
}: CreateServerMiddlewareOptions): RequestHandler => async (req, res) => {
  try {
    const start = Date.now();
    const history = createMemoryHistory({ initialEntries: [req.url] });
    const { store, wrappedRootEpic } = createConfiguredStore({
      history,
      wrapRootEpic,
      epicDependenciesOverrides,
    });

    const helmetContext = {};

    /**
     * React requires server-rendered markup to match client-side markup
     * on initial render.
     *
     * `getUniqueId` returns an increasing numerical value, starting at 1.
     * Since each browser will have its own `getUniqueId` starting at
     * 1, a new unique ID generator is required for each request
     * so that the IDs generated on the server match those generated
     * client-side.
     */
    const getUniqueId = createGetUniqueId();
    const chunkNames = new Set<string>();
    const pushChunk = (chunkName: string) => {
      if (chunkName !== undefined) {
        chunkNames.add(chunkName);
      }
    };

    const { markup } = await renderToString(
      /* eslint-disable react/jsx-max-depth */
      <ReportChunks report={pushChunk}>
        <HelmetProvider context={helmetContext}>
          <AppDependenciesContext.Provider
            value={{ ...defaultAppDependencies, getUniqueId }}
          >
            <Provider store={store}>
              <ConnectedRouter history={history}>
                <App routesMap={routesMap} />
              </ConnectedRouter>
            </Provider>
          </AppDependenciesContext.Provider>
        </HelmetProvider>
      </ReportChunks>,
      /* eslint-enable react/jsx-max-depth */
      wrappedRootEpic,
    ).toPromise();

    const state = store.getState();
    logger.debug('Server-side Redux state:', state);

    const statusCode = getStatusCode(state) || 200;
    res.status(statusCode);

    if (statusCode === 301 || statusCode === 302) {
      const url = getRedirectionUrl(state) as string;
      res.redirect(url);
    } else {
      const {
        js,
        styles,
        cssHash,
        scripts,
        stylesheets,
        publicPath,
      } = flushChunks(clientStats, { chunkNames: Array.from(chunkNames) });

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
        (helmetContext as PopulatedContext).helmet,
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

    const end = Date.now();
    logger.debug(`Request took ${end - start}ms to process`);
  } catch (error) {
    logger.error(error);
    res.status(500).send('Error');
  }
};
