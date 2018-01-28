import * as React from 'react';
import { Provider } from 'react-redux';
import { ConnectedRouter as Router } from 'react-router-redux';
import domready from 'domready';
import { hydrate } from 'react-dom';
import createBrowserHistory from 'history/createBrowserHistory';

import { App } from 'components/App/App';
import { createConfiguredStore } from 'store/createConfiguredStore';
import { StoreState } from 'store/types';
import { unhanldedErrorThrown } from 'store/features/logging/actions';
import { loadIntersectionObserverPolyfill } from 'helpers/loadPolyfill';

declare const __INITIAL_STATE__: StoreState | undefined;

const history = createBrowserHistory();

const { store } = createConfiguredStore(history, __INITIAL_STATE__);

const renderApp = (NewApp: typeof App = App) => {
  hydrate(
    <Provider store={store}>
      <Router history={history}>
        <NewApp />
      </Router>
    </Provider>,
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
    // tslint:disable-next-line no-require-imports
    const { App: NewApp } = require('components/App/App');
    renderApp(NewApp);
  });
}

loadIntersectionObserverPolyfill().then(() => {
  domready(renderApp);
});

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
