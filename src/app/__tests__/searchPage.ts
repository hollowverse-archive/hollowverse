import {
  ClientSideTestContext,
  createClientSideTestContext,
} from 'helpers/testHelpers';
import { delay } from 'helpers/delay';
import { LoadingSpinner } from 'components/LoadingSpinner/LoadingSpinner';
import { isSearchInProgress } from 'store/features/search/selectors';
import {
  stubNonEmptySearchResults,
  emptySearchResults,
} from 'fixtures/searchResults';

describe('Search page', () => {
  let context: ClientSideTestContext;

  describe('While typing,', () => {
    beforeEach(async () => {
      context = await createClientSideTestContext({
        createHistoryOptions: { initialEntries: ['/search'] },
        mockDataResponsesOverrides: {
          searchResults: stubNonEmptySearchResults,
        },
      });
    });

    it('updates the URL to match the search query', () => {
      const searchBox = context.wrapper.find('input[type="search"]');
      let params: URLSearchParams;

      searchBox.simulate('change', { target: { value: 'T' } });

      params = new URLSearchParams(context.history.location.search);

      expect(params.get('query')).toBe('T');

      searchBox.simulate('change', { target: { value: 'To' } });

      params = new URLSearchParams(context.history.location.search);

      expect(params.get('query')).toBe('To');
    });
  });

  describe('While results are being loaded,', () => {
    beforeEach(async () => {
      context = await createClientSideTestContext({
        createHistoryOptions: { initialEntries: ['/search'] },
        epicDependenciesOverrides: {
          getResponseForDataRequest: async payload => {
            if (payload.key === 'searchResults') {
              await delay(5000);

              return stubNonEmptySearchResults;
            }

            return payload.load();
          },
        },
      });
    });

    it('indicates loading status', () => {
      expect(isSearchInProgress(context.store.getState())).toBe(false);
      const searchBox = context.wrapper.find('input[type="search"]');
      searchBox.simulate('change', { target: { value: 'T' } });
      expect(isSearchInProgress(context.store.getState())).toBe(true);
      expect(context.wrapper.find(LoadingSpinner)).toBePresent();
    });
  });

  describe('When results have finished loading,', () => {
    beforeEach(async () => {
      context = await createClientSideTestContext({
        createHistoryOptions: { initialEntries: ['/search?query=Tom'] },
        mockDataResponsesOverrides: {
          searchResults: stubNonEmptySearchResults,
        },
      });
    });

    describe('When results are found,', () => {
      it('shows a list of results', () => {
        expect(context.wrapper).toIncludeText('Tom Hanks');
        expect(context.wrapper).toIncludeText('Tom Hardy');
      });

      it('results link to the respective notable person page', () => {
        context.wrapper.find('li').forEach(li => {
          for (const result of stubNonEmptySearchResults.hits) {
            if (li.contains(result.name)) {
              const a = li.find('a');
              expect(a).toBePresent();
              expect(a.render().attr('href')).toContain(result.slug);
            }
          }
        });
      });
    });

    describe('When no results are found,', () => {
      beforeEach(async () => {
        context = await createClientSideTestContext({
          createHistoryOptions: { initialEntries: ['/search?query=Tom'] },
          mockDataResponsesOverrides: {
            searchResults: emptySearchResults,
          },
        });
      });

      it('shows "No results found"', () => {
        expect(context.wrapper).toIncludeText('No results found');
      });
    });
  });

  describe('On load failure', () => {
    beforeEach(async () => {
      context = await createClientSideTestContext({
        createHistoryOptions: { initialEntries: ['/search?query=Tom'] },
        epicDependenciesOverrides: {
          getResponseForDataRequest: async payload => {
            if (payload.key === 'searchResults') {
              throw new TypeError();
            }

            return payload.load();
          },
        },
      });
    });

    it('offers to reload', () => {
      const linkButton = context.wrapper.findWhere(
        el => el.is('a') && Boolean(el.text().match(/reload/i)),
      );
      expect(linkButton).toBePresent();
      expect(linkButton.render().attr('href')).toMatch('/search?query=Tom');
    });
  });
});
