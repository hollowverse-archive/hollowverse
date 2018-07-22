import {
  TestContext,
  createTestContext,
  assertPageHasReloadButton,
} from 'helpers/testHelpers';
import { delay } from 'helpers/delay';
import {
  stubNonEmptySearchResults,
  emptySearchResults,
} from 'fixtures/searchResults';
import { fireEvent, getByText } from 'react-testing-library';

describe('search page', () => {
  let context: TestContext;

  describe('while typing,', () => {
    beforeEach(async () => {
      context = await createTestContext({
        createHistoryOptions: { initialEntries: ['/search'] },
        mockDataResponsesOverrides: {
          searchResults: stubNonEmptySearchResults,
        },
      });
    });

    it('updates the URL to match the search query', () => {
      const searchBox = document.body.querySelector(
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
      context = await createTestContext({
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
      const searchBox = document.body.querySelector(
        'input[type="search"]',
      ) as HTMLInputElement;

      searchBox.value = 'T';
      fireEvent.change(searchBox);

      expect(
        getByText(document.body, 'Loading...', { exact: false }),
      ).toBeInTheDocument();
    });
  });

  describe('when results have finished loading,', () => {
    beforeEach(async () => {
      context = await createTestContext({
        createHistoryOptions: { initialEntries: ['/search?query=Tom'] },
        mockDataResponsesOverrides: {
          searchResults: stubNonEmptySearchResults,
        },
      });
    });

    describe('when results are found,', () => {
      it('shows a list of results', () => {
        expect(document.body).toHaveTextContent('Tom Hanks');
        expect(document.body).toHaveTextContent('Tom Hardy');
      });

      it('results link to the respective notable person page', () => {
        Array.from(document.body.querySelectorAll('li')).forEach(li => {
          for (const result of stubNonEmptySearchResults.hits) {
            if (li.textContent && li.textContent.includes(result.name)) {
              const a = li.querySelector('a');
              expect(a!.getAttribute('href')).toMatch(result.slug);
            }
          }
        });
      });
    });

    describe('when no results are found,', () => {
      beforeEach(async () => {
        context = await createTestContext({
          createHistoryOptions: { initialEntries: ['/search?query=Tom'] },
          mockDataResponsesOverrides: {
            searchResults: emptySearchResults,
          },
        });
      });

      it('shows "No results found"', () => {
        expect(document.body).toHaveTextContent('No results found');
      });
    });
  });

  describe('on load failure', () => {
    beforeEach(async () => {
      context = await createTestContext({
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
