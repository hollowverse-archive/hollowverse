import * as React from 'react';
import { Switch, Route } from 'react-router';
import { NotablePerson } from 'pages/NotablePerson/NotablePerson';
import { SearchResults } from 'pages/SearchResults/SearchResults';
import { About } from 'pages/About/About';
import { PrivacyPolicy } from 'pages/PrivacyPolicy/PrivacyPolicy';
import { Home } from 'pages/Home/Home';
import { History } from 'history';
import { StoreState, ResolvedData, ResolvedDataKey } from 'store/types';
import { Store } from 'redux';
import { Provider } from 'react-redux';
import { HelmetProvider } from 'react-helmet-async';
import { ConnectedRouter } from 'react-router-redux';
import {
  AppDependenciesContext,
  defaultAppDependencies,
  AppDependencies,
} from 'appDependenciesContext';
import { ConnectedNavBar } from 'components/NavBar/ConnectedNavBar';
import {
  EpicDependencies,
  CreateConfiguredStoreOptions,
  createConfiguredStore,
} from 'store/createConfiguredStore';
import createMemoryHistory from 'history/createMemoryHistory';

type CreateTestTreeOptions = {
  history: History;
  store: Store<StoreState>;
  appDependencyOverrides?: Partial<AppDependencies>;
};

export const createMockGetResponseForDataRequest = <K extends ResolvedDataKey>(
  key: K,
  response: ResolvedData[K],
): EpicDependencies['getResponseForDataRequest'] => {
  return async payload => {
    if (payload.key === key) {
      return response;
    }

    return payload.load();
  };
};

const defaultTestDependencyOverrides: CreateConfiguredStoreOptions['dependencyOverrides'] = {
  sendLogs: jest.fn(),
  getResponseForDataRequest: jest.fn(),
};

export const createConfiguredStoreForTests = ({
  dependencyOverrides,
  history = createMemoryHistory(),
  ...rest
}: Partial<CreateConfiguredStoreOptions>) => {
  return createConfiguredStore({
    dependencyOverrides: {
      ...defaultTestDependencyOverrides,
      ...dependencyOverrides,
    },
    history,
    ...rest,
  });
};

export const createTestTree = ({
  history,
  store,
  appDependencyOverrides,
}: CreateTestTreeOptions) => (
  <HelmetProvider>
    <AppDependenciesContext.Provider
      value={{
        ...defaultAppDependencies,
        ...appDependencyOverrides,
      }}
    >
      <Provider store={store}>
        <ConnectedRouter history={history}>
          <div>
            <Route>
              {props => <ConnectedNavBar {...props} title="Hollowverse" />}
            </Route>
            <Switch>
              <Route path="/search" component={SearchResults} />
              <Route path="/about" component={About} />
              <Route path="/privacy-policy" component={PrivacyPolicy} />
              <Route path="/:slug" component={NotablePerson} />
              <Route component={Home} />
            </Switch>
          </div>
        </ConnectedRouter>
      </Provider>
    </AppDependenciesContext.Provider>
  </HelmetProvider>
);
