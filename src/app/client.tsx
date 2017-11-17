import * as React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import domready from 'domready';
import { Resolver } from 'react-resolver';

import { App } from 'components/App/App';

const renderApp = (NewApp: typeof App = App) => {
  Resolver.render(
    () => (
      <Router>
        <NewApp />
      </Router>
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
