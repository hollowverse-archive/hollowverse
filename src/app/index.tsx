import React from 'react';
import { Provider } from 'react-redux';
import { ConnectedRouter as Router } from 'react-router-redux';
import domready from 'domready';
import { render } from 'react-dom';
import createBrowserHistory from 'history/createBrowserHistory';

import { HotApp as App } from 'components/App/App';
import { createConfiguredStore } from 'store/createConfiguredStore';
import { unhandledErrorThrown } from 'store/features/logging/actions';
import {
  loadIntersectionObserverPolyfill,
  loadUrlPolyfill,
} from 'helpers/loadPolyfill';
import { HelmetProvider } from 'react-helmet-async';
import {
  AppDependenciesContext,
  defaultAppDependencies,
} from 'appDependenciesContext';
import { routesMap } from 'routesMap';
import { pick } from 'lodash';

const history = createBrowserHistory();

const { store } = createConfiguredStore({
  history,
});

// This has to be a class in order for hot module replacement to work
class Root extends React.PureComponent {
  /* eslint-disable-next-line class-methods-use-this */
  render() {
    return (
      <HelmetProvider>
        <AppDependenciesContext.Provider value={defaultAppDependencies}>
          <Provider store={store}>
            <Router history={history}>
              <App routesMap={routesMap} />
            </Router>
          </Provider>
        </AppDependenciesContext.Provider>
      </HelmetProvider>
    );
  }
}

const renderApp = () => {
  render(
    <Root />,
    // tslint:disable-next-line:no-non-null-assertion
    document.getElementById('app')!,
  );
};

const renderOnDomReady = () => {
  domready(renderApp);
};

declare const module: {
  hot?: { accept(path?: string, cb?: () => void): void };
};

if (module.hot) {
  module.hot.accept();
}

Promise.all([loadIntersectionObserverPolyfill(), loadUrlPolyfill()])
  .then(renderOnDomReady)
  .catch(renderOnDomReady);

window.addEventListener('error', ({ message, filename, lineno, colno }) => {
  store.dispatch(
    unhandledErrorThrown({
      location: pick(location, 'pathname', 'search', 'hash'),
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
        location: pick(location, 'pathname', 'search', 'hash'),
        message:
          typeof reason === 'object' && 'message' in reason
            ? reason.message
            : String(reason),
      }),
    );
  },
);
