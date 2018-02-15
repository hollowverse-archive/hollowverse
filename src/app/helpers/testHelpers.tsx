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
import { AppDependenciesContext, defaultAppDependencies, AppDependencies } from 'appDependenciesContext';
import { GraphQLClient } from 'graphql-request';

type CreateTestTreeOptions = {
  history: History;
  store: Store<StoreState>;
  appDependencyOverrides: Partial<AppDependencies>,
};

export const createMockApiClientWithResponse = (response: any) => {
  // @ts-ignore
  class MockApiClient implements GraphQLClient {
    url: string;
    options: string;

    constructor(url: string, options?: any) {
      this.url = url;
      this.options = options;
    }
  
    async request(_: string, __: Record<string, any>): Promise<any> {
      return response;
    }
  }

  return new MockApiClient('');
};

export const createTestTree = ({ history, store, appDependencyOverrides }: CreateTestTreeOptions) => (
  <HelmetProvider>
    <AppDependenciesContext.Provider
      value={{
        ...defaultAppDependencies,
        ...appDependencyOverrides,
      }}
    >
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
    </AppDependenciesContext.Provider>
  </HelmetProvider>
);
