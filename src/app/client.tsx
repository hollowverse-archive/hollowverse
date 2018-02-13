import * as React from 'react';
import { Provider } from 'react-redux';
import { ConnectedRouter as Router } from 'react-router-redux';
import domready from 'domready';
import { hydrate } from 'react-dom';
import createBrowserHistory from 'history/createBrowserHistory';
import createReactContext from 'create-react-context';

import { App } from 'components/App/App';
import { createConfiguredStore } from 'store/createConfiguredStore';
import { StoreState } from 'store/types';
import { unhanldedErrorThrown } from 'store/features/logging/actions';
import { loadIntersectionObserverPolyfill } from 'helpers/loadPolyfill';
import { HelmetProvider } from 'react-helmet-async';

declare const __INITIAL_STATE__: StoreState | undefined;

const history = createBrowserHistory();

const { store } = createConfiguredStore(history, __INITIAL_STATE__);

import { client as defaultApiClient } from 'api/client';

const defaultLoadAlgoliaModule = async () => import('vendor/algolia');

const defaultAppDependenciesContext = {
  apiClient: defaultApiClient,
  loadAlgoliaModule: defaultLoadAlgoliaModule,
};

export type AppDependenciesContext = typeof defaultAppDependenciesContext;
export const AppDependenciesContext = createReactContext(
  defaultAppDependenciesContext,
);

const renderApp = (NewApp: typeof App = App) => {
  hydrate(
    <HelmetProvider>
      <AppDependenciesContext.Provider value={defaultAppDependenciesContext}>
        <Provider store={store}>
          <Router history={history}>
            <NewApp />
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

loadIntersectionObserverPolyfill().then(renderOnDomReady).catch(renderOnDomReady);

// Catch unhandled errors and inform the store
window.onerror = (message, source, line, column) => {
  store.dispatch(
    unhanldedErrorThrown({
      message,
      source,
      line,
      column,
    }),
  );
};
