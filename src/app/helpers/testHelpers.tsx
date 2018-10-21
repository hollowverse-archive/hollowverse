/* eslint import/no-extraneous-dependencies: ["error", {"devDependencies": true}] */
/* tslint:disable no-non-null-assertion */

import React from 'react';
import { History, MemoryHistoryBuildOptions, createPath } from 'history';
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
import { delay } from 'helpers/delay';
import { once } from 'lodash';
import { App, AppRoutesMap } from 'components/App/App';
import { stubNotablePersonQueryResponse } from 'fixtures/notablePersonQuery';
import { stubNonEmptySearchResults } from 'fixtures/searchResults';

import { SearchResults } from 'pages/SearchResults/SearchResults';
import { ContactUs } from 'pages/ContactUs/ContactUs';
import { PrivacyPolicy } from 'pages/PrivacyPolicy/PrivacyPolicy';
import { NotablePerson } from 'pages/NotablePerson/NotablePerson';
import { Moderation } from 'pages/Moderation/Moderation';
import { Home } from 'pages/Home/Home';
import { UnboxPromise } from 'typings/typeHelpers';
import { EventEmitter } from 'events';

import JssProvider from 'react-jss/lib/JssProvider';
import { create, GenerateClassName } from 'jss';
import { jssPreset } from '@material-ui/core/styles';

/* eslint-disable react/jsx-max-depth */

import {
  render,
  fireEvent,
  getByText,
  waitForElement,
} from 'react-testing-library';

const defaultRoutesMap: AppRoutesMap = {
  '/search': SearchResults,
  '/contact': ContactUs,
  '/privacy-policy': PrivacyPolicy,
  '/:slug': NotablePerson,
  '/moderation': Moderation,
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

export const setUpLogListener: jest.ProvidesCallback = done => {
  window.addEventListener('pagehide', () => {
    done();
  });

  window.dispatchEvent(new Event('pagehide'));
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

    constructor() {
      this.emitter.setMaxListeners(16);
    }

    get status() {
      return this.actualStatus;
    }

    set status(newStatus) {
      const oldStatus = this.actualStatus;
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

  // @ts-ignore
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

  persistState: jest.fn(async _state => {
    return undefined;
  }),
};

export const assertPageHasReloadButton = (context: TestContext) => {
  const linkButton = getByText(
    document.body,
    (_, el) => el.textContent !== null && el.textContent.includes('Reload'),
    {
      selector: 'a',
      exact: false,
    },
  );
  expect(linkButton.getAttribute('href')).toBe(
    createPath(context.history.location),
  );
};

const jss = create(jssPreset());

const generateClassName: GenerateClassName = (rule, styleSheet) =>
  // @ts-ignore
  `${styleSheet.options.classNamePrefix}-${rule.key}`;

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
      {/*
        We use a customied JSS provider here to produce predictable class names in tests
        for snapshot tests
        See: https://github.com/mui-org/material-ui/issues/9492#issuecomment-368205258
        */}
      <JssProvider jss={jss} generateClassName={generateClassName}>
        <Provider store={store}>
          <ConnectedRouter history={history}>
            <App routesMap={routesMap} />
          </ConnectedRouter>
        </Provider>
      </JssProvider>
    </AppDependenciesContext.Provider>
  </HelmetProvider>
);

export type CreateClientSideTestContextOptions = Partial<{
  epicDependenciesOverrides: Partial<EpicDependencies>;
  createHistoryOptions: MemoryHistoryBuildOptions;
  mockDataResponsesOverrides: Partial<ResolvedData>;
  getPersistedStateToRestore(): Promise<Partial<StoreState>>;
}>;

export const attemptLogin = async ({
  context,
  waitUntilComplete = true,
}: {
  context: TestContext;
  waitUntilComplete?: boolean;
}) => {
  fireEvent.click(await context.toggleAppMenu().getLoginButton());
  if (waitUntilComplete) {
    await context.toggleAppMenu().getLogoutButton();
  }
};

export const attemptLogout = async ({
  context,
  waitUntilComplete = true,
}: {
  context: TestContext;
  waitUntilComplete?: boolean;
}) => {
  fireEvent.click(await context.toggleAppMenu().getLogoutButton());
  if (waitUntilComplete) {
    await context.toggleAppMenu().getLoginButton();
  }
};

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
export const createTestContext = async ({
  epicDependenciesOverrides = {},
  createHistoryOptions = { initialEntries: ['/'] },
  mockDataResponsesOverrides = {},
  getPersistedStateToRestore = async () => ({}),
  ...rest
}: Partial<CreateClientSideTestContextOptions> = {}) => {
  jest.restoreAllMocks();

  const { store, dependencies, history } = createConfiguredStore({
    initialState: await getPersistedStateToRestore(),
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

  render(tree);

  // Wait for immediately-resolved promises
  // to settle before executing the following statements
  await delay(0);

  const toggleAppMenu = () => {
    const menuButton = document.querySelector(
      '[aria-label="Open menu"]',
    ) as HTMLElement;

    fireEvent.click(menuButton);

    const menu = document.querySelector('#app-menu') as HTMLElement;

    // tslint:disable-next-line:prefer-object-spread
    return Object.assign(menu, {
      getNightModeToggle: () =>
        getByText(
          menu,
          (_, el) =>
            Boolean(el.textContent && el.textContent.match(/night mode/i)),
          {
            selector: '[role="menuitem"]',
            exact: false,
          },
        ),
      getLoginButton: async () =>
        (await waitForElement(() =>
          getByText(menu, 'log in', {
            selector: '[role="menuitem"]',
            exact: false,
          }),
        ))!,
      getLogoutButton: async () =>
        (await waitForElement(() =>
          getByText(menu, 'log out', {
            selector: '[role="menuitem"]',
            exact: false,
          }),
        ))!,
    });
  };

  return {
    toggleAppMenu,
    history,
    dependencies,
    getPersistedStateToRestore,
  };
};

export type TestContext = UnboxPromise<ReturnType<typeof createTestContext>>;
