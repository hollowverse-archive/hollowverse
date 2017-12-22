import * as React from 'react';
import { Provider } from 'react-redux';
import { ConnectedRouter as Router } from 'react-router-redux';
import domready from 'domready';
import { render } from 'react-dom';
import createBrowserHistory from 'history/createBrowserHistory';

import { App } from 'components/App/App';
import { createConfiguredStore } from 'store/store';
import { StoreState } from 'store/types';

declare const __INITIAL_STATE__: StoreState | undefined;

const history = createBrowserHistory();

const { store } = createConfiguredStore(history, __INITIAL_STATE__);

const renderApp = (NewApp: typeof App = App) => {
  render(
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

domready(renderApp);
