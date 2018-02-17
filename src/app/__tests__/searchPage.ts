import { getStatusCode } from 'store/features/status/reducer';
import {
  createMockGetResponseForDataRequest,
  TestContext,
  createTestContext,
} from 'helpers/testHelpers';
import { delay } from 'helpers/delay';
import { LoadingSpinner } from 'components/LoadingSpinner/LoadingSpinner';
import { isSearchInProgress } from 'store/features/search/selectors';

const stubNonEmptySearchResults = {
  hits: [
    {
      slug: 'Tom_Hanks',
      name: 'Tom Hanks',
      mainPhoto: null,
      objectID: '123',
    },
    {
      slug: 'Tom_Hardy',
      name: 'Tom Hardy',
      mainPhoto: null,
      objectID: '456',
    },
  ],
  hitsPerPage: 10,
  nbHits: 2,
  nbPages: 1,
  page: 0,
  params: '',
  processingTimeMS: 1,
  query: 'Tom',
};

describe('Search page', () => {
  let context: TestContext;

  describe('While typing,', () => {
    beforeEach(async () => {
      context = await createTestContext({
        createHistoryOptions: { initialEntries: ['/search'] },
        epicDependenciesOverrides: {
          getResponseForDataRequest: createMockGetResponseForDataRequest(
            'searchResults',
            stubNonEmptySearchResults,
          ),
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
      expect(isSearchInProgress(context.store.getState())).toBe(false);
      const searchBox = context.wrapper.find('input[type="search"]');
      searchBox.simulate('change', { target: { value: 'T' } });
      expect(isSearchInProgress(context.store.getState())).toBe(true);
      expect(context.wrapper.find(LoadingSpinner)).toBePresent();
    });
  });

  describe('When results have finished loading,', () => {
    beforeEach(async () => {
      context = await createTestContext({
        createHistoryOptions: { initialEntries: ['/search?query=Tom'] },
        epicDependenciesOverrides: {
          getResponseForDataRequest: createMockGetResponseForDataRequest(
            'searchResults',
            stubNonEmptySearchResults,
          ),
        },
      });
    });

    describe('When results are found,', () => {
      it('returns 200', () => {
        expect(getStatusCode(context.store.getState())).toBe(200);
      });

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
        context = await createTestContext({
          createHistoryOptions: { initialEntries: ['/search?query=Tom'] },
          epicDependenciesOverrides: {
            getResponseForDataRequest: createMockGetResponseForDataRequest(
              'searchResults',
              {
                hits: [],
                hitsPerPage: 10,
                nbHits: 0,
                nbPages: 1,
                page: 0,
                params: '',
                processingTimeMS: 1,
                query: 'Tom',
              },
            ),
          },
        });
      });

      it('returns 404', () => {
        expect(getStatusCode(context.store.getState())).toBe(404);
      });

      it('shows "No results found"', () => {
        expect(context.wrapper).toIncludeText('No results found');
      });
    });
  });
});
