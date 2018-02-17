import * as React from 'react';
import { Switch, Route } from 'react-router';
import { NotablePerson } from 'pages/NotablePerson/NotablePerson';
import { SearchResults } from 'pages/SearchResults/SearchResults';
import { About } from 'pages/About/About';
import { PrivacyPolicy } from 'pages/PrivacyPolicy/PrivacyPolicy';
import { Home } from 'pages/Home/Home';
import { History, MemoryHistoryBuildOptions } from 'history';
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
import { mount, ReactWrapper } from 'enzyme';
import { delay } from 'helpers/delay';

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

const defaultTestDependencyOverrides: CreateConfiguredStoreOptions['epicDependenciesOverrides'] = {
  sendLogs: jest.fn(),
  getResponseForDataRequest: jest.fn(),
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

export type TestContext = {
  store: Store<StoreState>;
  history: History;
  wrapper: ReactWrapper<any>;
  dependencies: EpicDependencies;
};

export type CreateTestContextOptions = Partial<{
  epicDependenciesOverrides: Partial<EpicDependencies>;
  createHistoryOptions: MemoryHistoryBuildOptions;
}>;

export const createTestContext = async ({
  epicDependenciesOverrides = {},
  createHistoryOptions = { initialEntries: ['/'] },
  ...rest
}: Partial<CreateTestContextOptions> = {}): Promise<TestContext> => {
  const { store, dependencies, history } = createConfiguredStore({
    epicDependenciesOverrides: {
      ...defaultTestDependencyOverrides,
      ...epicDependenciesOverrides,
    },
    history: createMemoryHistory({
      ...createHistoryOptions,
    }),
    ...rest,
  });

  const tree = createTestTree({
    history,
    store,
  });

  const wrapper = mount(tree);

  // Force promises to settle by scheduling
  // the following statements after `setTimeout`
  await delay(0);
  wrapper.update();

  return { wrapper, store, history, dependencies };
};
