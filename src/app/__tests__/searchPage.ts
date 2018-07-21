import {
  ClientSideTestContext,
  createClientSideTestContext,
  assertPageHasReloadButton,
} from 'helpers/testHelpers';
import { delay } from 'helpers/delay';
import { isSearchInProgress } from 'store/features/search/selectors';
import {
  stubNonEmptySearchResults,
  emptySearchResults,
} from 'fixtures/searchResults';
import { fireEvent } from 'react-testing-library';

describe('search page', () => {
  let context: ClientSideTestContext;

  describe('while typing,', () => {
    beforeEach(async () => {
      context = await createClientSideTestContext({
        createHistoryOptions: { initialEntries: ['/search'] },
        mockDataResponsesOverrides: {
          searchResults: stubNonEmptySearchResults,
        },
      });
    });

    it('updates the URL to match the search query', () => {
      const searchBox = context.wrapper.container.querySelector(
        'input[type="search"]',
      ) as HTMLInputElement;
      let params: URLSearchParams;

      searchBox.value = 'T';
      fireEvent.change(searchBox);

      params = new URLSearchParams(context.history.location.search);

      expect(params.get('query')).toBe('T');

      searchBox.value = 'To';
      fireEvent.change(searchBox);

      params = new URLSearchParams(context.history.location.search);

      expect(params.get('query')).toBe('To');
    });
  });

  describe('while results are being loaded,', () => {
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
      const searchBox = context.wrapper.container.querySelector(
        'input[type="search"]',
      ) as HTMLInputElement;

      searchBox.value = 'T';
      fireEvent.change(searchBox);

      expect(isSearchInProgress(context.store.getState())).toBe(true);
      expect(
        context.wrapper.container.querySelector('[aria-label="Loading..."]'),
      ).toBeInTheDocument();
    });
  });

  describe('when results have finished loading,', () => {
    beforeEach(async () => {
      context = await createClientSideTestContext({
        createHistoryOptions: { initialEntries: ['/search?query=Tom'] },
        mockDataResponsesOverrides: {
          searchResults: stubNonEmptySearchResults,
        },
      });
    });

    describe('when results are found,', () => {
      it('shows a list of results', () => {
        expect(context.wrapper.container).toHaveTextContent('Tom Hanks');
        expect(context.wrapper.container).toHaveTextContent('Tom Hardy');
      });

      it('results link to the respective notable person page', () => {
        Array.from(context.wrapper.container.querySelectorAll('li')).forEach(
          li => {
            for (const result of stubNonEmptySearchResults.hits) {
              if (li.textContent && li.textContent.includes(result.name)) {
                const a = li.querySelector('a');
                expect(a!.getAttribute('href')).toMatch(result.slug);
              }
            }
          },
        );
      });
    });

    describe('when no results are found,', () => {
      beforeEach(async () => {
        context = await createClientSideTestContext({
          createHistoryOptions: { initialEntries: ['/search?query=Tom'] },
          mockDataResponsesOverrides: {
            searchResults: emptySearchResults,
          },
        });
      });

      it('shows "No results found"', () => {
        expect(context.wrapper.container).toHaveTextContent('No results found');
      });
    });
  });

  describe('on load failure', () => {
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
      assertPageHasReloadButton(context);
    });
  });
});
