import * as React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import domready from 'domready';
import { Resolver } from 'react-resolver';

import { App } from 'components/App';

const renderApp = () =>
  Resolver.render(
    () => (
      <Router>
        <App />
      </Router>
    ),
    document.getElementById('app'),
  );

// @ts-ignore
if (module.hot) {
  // @ts-ignore
  module.hot.accept();
  // @ts-ignore
  module.hot.accept('components/App', renderApp);
}

domready(renderApp);
