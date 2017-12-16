import * as React from 'react';
import { Provider } from 'react-redux';
import { ConnectedRouter as Router } from 'react-router-redux';
import domready from 'domready';
import { Resolver } from 'react-resolver';
import createBrowserHistory from 'history/createBrowserHistory';

import { App } from 'components/App/App';
import { createStoreWithInitialState } from 'store/store';
import { StoreState } from 'store/types';

declare const __INITIAL_STATE__: StoreState | undefined;

const renderApp = (NewApp: typeof App = App) => {
  Resolver.render(
    () => (
      <Provider store={createStoreWithInitialState(__INITIAL_STATE__)}>
        <Router history={createBrowserHistory()}>
          <NewApp />
        </Router>
      </Provider>
    ),
    document.getElementById('app'),
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

domready(renderApp);
