import React from 'react';
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
import {
  EpicDependencies,
  createConfiguredStore,
} from 'store/createConfiguredStore';
import createMemoryHistory from 'history/createMemoryHistory';
import { mount, ReactWrapper } from 'enzyme';
import { delay } from 'helpers/delay';
import { once } from 'lodash';
import { AppRoutesMap, App } from 'components/App/App';

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

export const defaultTestDependencyOverrides: Partial<EpicDependencies> = {
  sendLogs: jest.fn(),
  getResponseForDataRequest: jest.fn(),
  getGoogleAnalyticsFunction: jest.fn(
    once(async () => {
      const mockTracker: UniversalAnalytics.Tracker = {
        get: jest.fn(),
        set: jest.fn(),
        send: jest.fn(),
      };

      return Object.assign(jest.fn(() => undefined), {
        getByName: jest.fn(() => mockTracker),
        getAll: jest.fn(() => [mockTracker]),
        create: jest.fn(() => mockTracker),
        remove: jest.fn(() => undefined),
        l: 0,
        q: [],
      });
    }),
  ),
};

export const testRoutesMap: AppRoutesMap = {
  '/search': SearchResults,
  '/about': About,
  '/privacy-policy': PrivacyPolicy,
  '/:slug': NotablePerson,
  default: Home,
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
          <App routesMap={testRoutesMap} />
        </ConnectedRouter>
      </Provider>
    </AppDependenciesContext.Provider>
  </HelmetProvider>
);

export type ClientSideTestContext = {
  store: Store<StoreState>;
  history: History;
  wrapper: ReactWrapper<any>;
  dependencies: EpicDependencies;
};

export type CreateClientSideTestContextOptions = Partial<{
  epicDependenciesOverrides: Partial<EpicDependencies>;
  createHistoryOptions: MemoryHistoryBuildOptions;
}>;

/**
 * Creates a new app tree with a new store instance for each test
 * The epic dependencies are replaced with mock functions so that we
 * avoid sending actual network requests.
 *
 * The mock functions are created with `jest.fn()`
 * so they can be spied on.
 *
 * Almost all configuration options can be overridden for convenience.
 */
export const createClientSideTestContext = async ({
  epicDependenciesOverrides = {},
  createHistoryOptions = { initialEntries: ['/'] },
  ...rest
}: Partial<CreateClientSideTestContextOptions> = {}): Promise<
  ClientSideTestContext
> => {
  const { store, dependencies, history } = createConfiguredStore({
    epicDependenciesOverrides: {
      ...defaultTestDependencyOverrides,
      ...epicDependenciesOverrides,
    },
    history: createMemoryHistory(createHistoryOptions),
    ...rest,
  });

  const tree = createTestTree({
    history,
    store,
  });

  const wrapper = mount(tree);

  // Wait for immediately-resolved promises
  // to settle before executing the following statements
  await delay(0);
  wrapper.update();

  return { wrapper, store, history, dependencies };
};
