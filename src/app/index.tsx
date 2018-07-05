import '@babel/polyfill';

import React from 'react';
import { Provider, connect } from 'react-redux';
import { ConnectedRouter as Router } from 'react-router-redux';
import domready from 'domready';
import { render } from 'react-dom';
import createBrowserHistory from 'history/createBrowserHistory';

import { HotApp as App } from 'components/App/App';
import { createConfiguredStore } from 'store/createConfiguredStore';
import { unhandledErrorThrown } from 'store/features/logging/actions';
import {
  loadIntersectionObserverPolyfill,
  loadUrlPolyfill,
  loadFocusVisiblePolyfill,
} from 'helpers/loadPolyfill';
import { HelmetProvider } from 'react-helmet-async';
import {
  AppDependenciesContext,
  defaultAppDependencies,
} from 'appDependenciesContext';
import { routesMap } from 'routesMap';
import { pick } from 'lodash';
import { isError } from 'util';
import { importGlobalScript } from 'helpers/importGlobalScript';
import {
  setFbSdkAuthState,
  facebookAuthResponseChanged,
} from 'store/features/auth/actions';
import { GraphQLClient } from 'graphql-request';
import { getAccessToken } from 'store/features/auth/reducer';
import { StoreState } from 'store/types';

const history = createBrowserHistory();

const { store } = createConfiguredStore({
  history,
});

const ConnectedApp = connect((state: StoreState) => ({
  accessToken: getAccessToken(state),
}))(({ accessToken }) => (
  <AppDependenciesContext.Provider
    value={{
      ...defaultAppDependencies,
      apiClient: new GraphQLClient(__API_ENDPOINT__, {
        // Use `GET` for public queries to take advantage from
        // CDN caching of API responses.
        // `POST` is used for logged-in users because mutations
        // require `POST` requests. `POST` requests are never cached.
        method: accessToken ? 'POST' : 'GET',
        headers: {
          Authorization: accessToken ? `Bearer ${accessToken}` : '',
        },
      }),
    }}
  >
    <Router history={history}>
      <App routesMap={routesMap} />
    </Router>
  </AppDependenciesContext.Provider>
));

// This has to be a class in order for hot module replacement to work
class Root extends React.PureComponent {
  /* eslint-disable-next-line class-methods-use-this */
  render() {
    return (
      <HelmetProvider>
        <Provider store={store}>
          <ConnectedApp />
        </Provider>
      </HelmetProvider>
    );
  }
}

importGlobalScript('https://connect.facebook.net/en_US/sdk.js')
  .then(() => {
    FB.init({
      appId: __FB_APP_ID__,
      status: true,
      version: 'v2.7',
      xfbml: true,
    });

    FB.getLoginStatus(response => {
      store.dispatch(facebookAuthResponseChanged(response.authResponse));

      FB.Event.subscribe('auth.authResponseChange', event => {
        store.dispatch(facebookAuthResponseChanged(event.authResponse));
      });
    }, true);

    FB.Event.subscribe('auth.login', () => {
      store.dispatch(setFbSdkAuthState({ state: 'loggingIn' }));
    });

    FB.Event.subscribe('auth.logout', () => {
      store.dispatch(setFbSdkAuthState({ state: 'loggingOut' }));
    });
  })
  .catch(error => {
    store.dispatch(setFbSdkAuthState({ state: 'error', error }));
  });

const renderApp = () => {
  render(
    <Root />,
    // tslint:disable-next-line:no-non-null-assertion
    document.getElementById('app')!,
  );
};

const renderOnDomReady = () => {
  domready(renderApp);
};

declare const module: {
  hot?: { accept(path?: string, cb?: () => void): void };
};

if (module.hot) {
  module.hot.accept();
}

Promise.all([
  loadIntersectionObserverPolyfill(),
  loadUrlPolyfill(),
  loadFocusVisiblePolyfill(),
])
  .then(renderOnDomReady)
  .catch(renderOnDomReady);

window.addEventListener(
  'error',
  ({ message, error, filename, lineno, colno }) => {
    store.dispatch(
      unhandledErrorThrown({
        location: pick(location, 'pathname', 'search', 'hash'),
        name: 'Unknown Error',
        source: filename,
        line: lineno,
        column: colno,
        message,
        ...(isError(error) ? error : undefined),
      }),
    );
  },
);

// @ts-ignore
window.onunhandledrejection = ({ reason }: PromiseRejectionEvent) => {
  store.dispatch(
    unhandledErrorThrown({
      location: pick(location, 'pathname', 'search', 'hash'),
      name: 'Unhandled Rejection',
      message: String(reason),
      ...(isError(reason) ? reason : undefined),
    }),
  );
};
