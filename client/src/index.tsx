import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { ApolloProvider } from 'react-apollo';
import { client } from './apolloClient';

import { App } from 'components/App';

import NotablePersonPage from 'pages/notablePerson/notablePerson';

const renderApp = () =>
  ReactDOM.render(
    // @ts-ignore
    <ApolloProvider client={client}>
      <Router>
        <App>
          <Switch>
            <Route path="/:slug" component={NotablePersonPage} />
          </Switch>
        </App>
      </Router>
    </ApolloProvider>,
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
