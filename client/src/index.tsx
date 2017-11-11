import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';

import { App } from 'components/App';

import NotablePersonPage from 'pages/notablePerson/notablePerson';

const renderApp = () =>
  ReactDOM.render(
    <Router>
      <App>
        <Switch>
          <Route path="/:slug" component={NotablePersonPage} />
        </Switch>
      </App>
    </Router>,
    document.getElementById('app'),
  );

// @ts-ignore
if (module.hot) {
  // @ts-ignore
  module.hot.accept();
  // @ts-ignore
  module.hot.accept('components/App', renderApp);
}

renderApp();
