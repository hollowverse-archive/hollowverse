import React from 'react';
import { Provider } from 'react-redux';
import { ConnectedRouter as Router } from 'react-router-redux';
import domready from 'domready';
import { hydrate } from 'react-dom';
import createBrowserHistory from 'history/createBrowserHistory';

import { App } from 'components/App/App';
import { createConfiguredStore } from 'store/createConfiguredStore';
import { StoreState } from 'store/types';
import { unhandledErrorThrown } from 'store/features/logging/actions';
import {
  loadIntersectionObserverPolyfill,
  loadFetchPolyfill,
  loadUrlPolyfill,
} from 'helpers/loadPolyfill';
import { HelmetProvider } from 'react-helmet-async';
import {
  AppDependenciesContext,
  defaultAppDependencies,
} from 'appDependenciesContext';
import { routesMap } from 'routesMap';

declare const __INITIAL_STATE__: StoreState | undefined;

const history = createBrowserHistory();

const { store } = createConfiguredStore({
  history,
  initialState: __INITIAL_STATE__,
});

const renderApp = (NewApp: typeof App = App) => {
  hydrate(
    <HelmetProvider>
      <AppDependenciesContext.Provider value={defaultAppDependencies}>
        <Provider store={store}>
          <Router history={history}>
            <NewApp routesMap={routesMap} />
          </Router>
        </Provider>
      </AppDependenciesContext.Provider>
    </HelmetProvider>,
    // tslint:disable-next-line:no-non-null-assertion
    document.getElementById('app')!,
  );
};

declare const module: {
  hot?: { accept(path?: string, cb?: () => void): void };
};

if (module.hot) {
  module.hot.accept();
  module.hot.accept('components/App/App', () => {
    // tslint:disable no-require-imports no-unsafe-any
    const { App: NewApp } = require('components/App/App');
    renderApp(NewApp);
    // tslint:enable no-require-imports no-unsafe-any
  });
}

const renderOnDomReady = () => {
  domready(renderApp);
};

Promise.all([
  loadIntersectionObserverPolyfill(),
  loadUrlPolyfill(),
  loadFetchPolyfill(),
])
  .then(renderOnDomReady)
  .catch(renderOnDomReady);

window.addEventListener('error', ({ message, filename, lineno, colno }) => {
  store.dispatch(
    unhandledErrorThrown({
      message,
      source: filename,
      line: lineno,
      column: colno,
    }),
  );
});

window.addEventListener(
  'unhandledrejection',
  // @ts-ignore
  ({ reason }: PromiseRejectionEvent) => {
    store.dispatch(
      unhandledErrorThrown({
        message: reason,
      }),
    );
  },
);
