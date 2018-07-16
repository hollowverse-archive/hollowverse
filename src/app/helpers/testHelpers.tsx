/* eslint import/no-extraneous-dependencies: ["error", {"devDependencies": true}] */

import React from 'react';
import { History, MemoryHistoryBuildOptions } from 'history';
import { StoreState, ResolvedData } from 'store/types';
import { Store } from 'redux';
import { Provider } from 'react-redux';
import uuid from 'uuid/v4';
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
import { mount } from 'enzyme';
import { delay } from 'helpers/delay';
import { once } from 'lodash';
import { App, AppRoutesMap } from 'components/App/App';
import { stubNotablePersonQueryResponse } from 'fixtures/notablePersonQuery';
import { stubNonEmptySearchResults } from 'fixtures/searchResults';

import { SearchResults } from 'pages/SearchResults/SearchResults';
import { ContactUs } from 'pages/ContactUs/ContactUs';
import { PrivacyPolicy } from 'pages/PrivacyPolicy/PrivacyPolicy';
import { NotablePerson } from 'pages/NotablePerson/NotablePerson';
import { Home } from 'pages/Home/Home';
import { UnboxPromise } from 'typings/typeHelpers';
import { EventEmitter } from 'events';

const defaultRoutesMap: AppRoutesMap = {
  '/search': SearchResults,
  '/contact': ContactUs,
  '/privacy-policy': PrivacyPolicy,
  '/:slug': NotablePerson,
  default: Home,
};

type CreateTestTreeOptions = {
  history: History;
  store: Store<StoreState>;
  appDependencyOverrides?: Partial<AppDependencies>;
  routesMap?: AppRoutesMap;
};

export const defaultMockDataResponses: Partial<ResolvedData> = {
  notablePersonQuery: stubNotablePersonQueryResponse,
  searchResults: stubNonEmptySearchResults,
};

export const createMockGetResponseForDataRequest = (
  responseByDataKey: Partial<ResolvedData>,
): EpicDependencies['getResponseForDataRequest'] => async payload => {
  const response = responseByDataKey[payload.key];

  if (response !== undefined) {
    return response;
  }

  return payload.load();
};

type CreateMockFbSdkOption = {
  onLoginRequested?(): FB.LoginStatusResponse;
  onLogoutRequested?(): FB.LoginStatusResponse;
};

const respondWithSuccessfulLogoutState: CreateMockFbSdkOption['onLogoutRequested'] = () => ({
  authResponse: undefined,
  status: 'not_authorized',
});

const respondWithSuccessfulLoginState: CreateMockFbSdkOption['onLoginRequested'] = () => ({
  authResponse: {
    accessToken: '<valid access token>',
    expiresIn: 3600,
    signedRequest: '<valid signed request>',
    userID: '<valid user ID>',
  },
  status: 'connected',
});

export const createMockFbSdk = ({
  onLoginRequested = respondWithSuccessfulLoginState,
  onLogoutRequested = respondWithSuccessfulLogoutState,
}: CreateMockFbSdkOption = {}) => {
  const state = new class FbSdkInternalState {
    emitter = new EventEmitter();

    private actualStatus: FB.LoginStatusResponse = {
      status: 'not_authorized',
      authResponse: undefined,
    };

    get status() {
      return this.actualStatus;
    }

    set status(newStatus) {
      const oldStatus = { ...this.actualStatus };
      this.actualStatus = newStatus;

      this.emitter.emit('auth.authResponseChange', newStatus);

      if (newStatus.status !== oldStatus.status) {
        this.emitter.emit('auth.statusChange', newStatus);
      }
    }
  }();

  // tslint:disable-next-line no-unnecessary-local-variable
  const sdk: FB = {
    init() {
      return undefined;
    },

    Event: {
      subscribe: jest.fn<FB['Event']['subscribe']>((event, listener) => {
        state.emitter.addListener(event, listener);
      }),

      unsubscribe: jest.fn<FB['Event']['unsubscribe']>((event, listener) => {
        state.emitter.removeListener(event, listener);
      }),
    },

    getAuthResponse: jest.fn<FB['getAuthResponse']>(() => {
      return state.status.authResponse;
    }),

    getLoginStatus: jest.fn<FB['getLoginStatus']>(callback => {
      callback(state.status);
    }),

    login: jest.fn<FB['login']>(async callback => {
      state.emitter.emit('auth.login');

      await delay(0);

      state.status = onLoginRequested();

      if (callback) {
        callback(state.status.authResponse);
      }
    }),

    logout: jest.fn<FB['logout']>(async callback => {
      state.emitter.emit('auth.logout');

      await delay(0);

      state.status = onLogoutRequested();

      if (callback) {
        callback(state.status.authResponse);
      }
    }),

    XFBML: {
      parse(_node, callback) {
        if (typeof callback === 'function') {
          callback();
        }
      },
    },
  };

  global.FB = sdk;

  return sdk;
};

export const defaultTestDependencyOverrides: Partial<EpicDependencies> = {
  sendLogs: jest.fn(),

  getSessionId: once(uuid),
  getUserAgent: () => 'Test Agent',

  getResponseForDataRequest: jest.fn(
    createMockGetResponseForDataRequest(defaultMockDataResponses),
  ),
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
  getFbSdk: jest.fn(once(async () => createMockFbSdk())),
};

export const createTestTree = ({
  history,
  store,
  appDependencyOverrides,
  routesMap = defaultRoutesMap,
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
          <App routesMap={routesMap} />
        </ConnectedRouter>
      </Provider>
    </AppDependenciesContext.Provider>
  </HelmetProvider>
);

export type CreateClientSideTestContextOptions = Partial<{
  epicDependenciesOverrides: Partial<EpicDependencies>;
  createHistoryOptions: MemoryHistoryBuildOptions;
  mockDataResponsesOverrides: Partial<ResolvedData>;
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
  mockDataResponsesOverrides = {},
  ...rest
}: Partial<CreateClientSideTestContextOptions> = {}) => {
  const { store, dependencies, history } = createConfiguredStore({
    epicDependenciesOverrides: {
      ...defaultTestDependencyOverrides,
      ...epicDependenciesOverrides,
      getResponseForDataRequest: jest.fn(
        epicDependenciesOverrides.getResponseForDataRequest
          ? epicDependenciesOverrides.getResponseForDataRequest
          : createMockGetResponseForDataRequest({
              ...defaultMockDataResponses,
              ...mockDataResponsesOverrides,
            }),
      ),
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

  const openAppMenu = () => {
    const menuButton = wrapper
      .find('#app-menu-wrapper [role="button"]')
      .first();

    menuButton.simulate('click');

    return wrapper.find('#app-menu-wrapper [role="menu"]').first();
  };

  return { wrapper, openAppMenu, store, history, dependencies };
};

export type ClientSideTestContext = UnboxPromise<
  ReturnType<typeof createClientSideTestContext>
>;
