import * as React from 'react';
import 'expect-more-jest';
import { ConnectedRouter } from 'react-router-redux';
import { App } from 'components/App/App';
import { createConfiguredStore } from 'store/createConfiguredStore';
import createMemoryHistory from 'history/createMemoryHistory';
import { Provider } from 'react-redux';
import { HelmetProvider } from 'react-helmet-async';

describe('Testing tests', () => {
  it('should work', () => {
    const history = createMemoryHistory({ initialEntries: ['/'] });
    const { store } = createConfiguredStore(history);
    const tree = (
      <HelmetProvider>
        <Provider store={store}>
          <ConnectedRouter history={history}>
            <App />
          </ConnectedRouter>
        </Provider>
      </HelmetProvider>
    );
  });

  it('should not work', () => {
    expect(1).toBe(2);
  });
});