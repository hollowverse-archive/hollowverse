import 'expect-more-jest';
import * as React from 'react';
import { ConnectedRouter } from 'react-router-redux';
import { App } from 'components/App/App';
import { createConfiguredStore } from 'store/createConfiguredStore';
import createMemoryHistory from 'history/createMemoryHistory';
import { Provider } from 'react-redux';
import { HelmetProvider } from 'react-helmet-async';
import { create } from 'react-test-renderer';

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
    const renderer = create(tree);
    expect(renderer.toJSON()).toMatchSnapshot();
  });

  it('should not work', () => {
    expect(1).toBeGreaterThan(1);
  });
});
