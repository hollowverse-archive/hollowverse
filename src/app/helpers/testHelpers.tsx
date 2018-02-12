import * as React from 'react';
import { Switch, Route } from 'react-router';
import { NotablePerson } from 'pages/NotablePerson/NotablePerson';
import { SearchResults } from 'pages/SearchResults/SearchResults';
import { About } from 'pages/About/About';
import { PrivacyPolicy } from 'pages/PrivacyPolicy/PrivacyPolicy';
import { Home } from 'pages/Home/Home';
import { History } from 'history';
import { StoreState } from 'store/types';
import { Store } from 'redux';
import { Provider } from 'react-redux';
import { HelmetProvider } from 'react-helmet-async';
import { ConnectedRouter, push } from 'react-router-redux';
import { App } from 'components/App/App';

type CreateTestTreeOptions = {
  history: History;
  store: Store<StoreState>;
};

export const createTestTree = ({ history, store }: CreateTestTreeOptions) => (
  <HelmetProvider>
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <Switch>
          <Route path="/search" component={SearchResults} />
          <Route path="/about" component={About} />
          <Route path="/privacy-policy" component={PrivacyPolicy} />
          <Route path="/:slug" component={NotablePerson} />
          <Route component={Home} />
        </Switch>
      </ConnectedRouter>
    </Provider>
  </HelmetProvider>
);
