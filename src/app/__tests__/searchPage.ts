import { EpicDependencies } from 'store/createConfiguredStore';
import createMemoryHistory from 'history/createMemoryHistory';
import { getStatusCode } from 'store/features/status/reducer';
import { mount, ReactWrapper } from 'enzyme';
import {
  createTestTree,
  createMockGetResponseForDataRequest,
  createConfiguredStoreForTests,
} from 'helpers/testHelpers';
import { Store } from 'redux';
import { StoreState } from 'store/types';
import { History } from 'history';
import { delay } from 'helpers/delay';
import { LoadingSpinner } from 'components/LoadingSpinner/LoadingSpinner';
import { isSearchInProgress } from 'store/features/search/selectors';
import { AlgoliaResponse } from 'algoliasearch';

describe('Search page', () => {
  let wrapper: ReactWrapper<any>;
  let store: Store<StoreState>;
  let history: History | undefined;
  let getSearchResultsResponse: EpicDependencies['getResponseForDataRequest'];
  let searchResults: AlgoliaResponse;
  let initializeStoreAndTree: () => Promise<void>;

  beforeAll(() => {
    initializeStoreAndTree = async () => {
      ({ store, history } = createConfiguredStoreForTests({
        epicDependenciesOverrides: {
          getResponseForDataRequest: getSearchResultsResponse,
        },
        history,
      }));

      const tree = createTestTree({
        history,
        store,
      });

      wrapper = mount(tree);

      // Force promises to settle by scheduling
      // the following statements after `setTimeout`
      await delay(0);
      wrapper.update();
    };
  });

  beforeEach(() => {
    expect.hasAssertions();
    searchResults = {
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

    getSearchResultsResponse = createMockGetResponseForDataRequest(
      'searchResults',
      searchResults,
    );
  });

  describe('While typing,', () => {
    beforeEach(async () => {
      history = createMemoryHistory({ initialEntries: ['/search'] });

      await initializeStoreAndTree();
    });

    it('updates the URL to match the search query', () => {
      const searchBox = wrapper.find('input[type="search"]');
      let params: URLSearchParams;

      searchBox.simulate('change', { target: { value: 'T' } });

      params = new URLSearchParams(history!.location.search);

      expect(params.get('query')).toBe('T');

      searchBox.simulate('change', { target: { value: 'To' } });

      params = new URLSearchParams(history!.location.search);

      expect(params.get('query')).toBe('To');
    });
  });

  describe('While results are being loaded,', () => {
    beforeEach(async () => {
      history = createMemoryHistory({ initialEntries: ['/search'] });

      getSearchResultsResponse = async payload => {
        if (payload.key === 'searchResults') {
          await delay(5000);

          return searchResults;
        }

        return payload.load();
      };

      await initializeStoreAndTree();
    });

    it('indicates loading status', () => {
      expect(isSearchInProgress(store.getState())).toBe(false);
      const searchBox = wrapper.find('input[type="search"]');
      searchBox.simulate('change', { target: { value: 'T' } });
      expect(isSearchInProgress(store.getState())).toBe(true);
      expect(wrapper.find(LoadingSpinner)).toBePresent();
    });
  });

  describe('When results have finished loading,', () => {
    beforeEach(async () => {
      history = createMemoryHistory({ initialEntries: ['/search?query=Tom'] });

      await initializeStoreAndTree();
    });

    describe('When results are found,', () => {
      it('returns 200', () => {
        expect(getStatusCode(store.getState())).toBe(200);
      });

      it('shows a list of results', () => {
        expect(wrapper).toIncludeText('Tom Hanks');
        expect(wrapper).toIncludeText('Tom Hardy');
      });

      it('results link to the respective notable person page', () => {
        wrapper.find('li').forEach(li => {
          for (const result of searchResults.hits) {
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
        searchResults = {
          hits: [],
          hitsPerPage: 10,
          nbHits: 0,
          nbPages: 1,
          page: 0,
          params: '',
          processingTimeMS: 1,
          query: 'Tom',
        };

        getSearchResultsResponse = createMockGetResponseForDataRequest(
          'searchResults',
          searchResults,
        );

        await initializeStoreAndTree();
      });

      it('returns 404', () => {
        expect(getStatusCode(store.getState())).toBe(404);
      });

      it('shows "No results found"', () => {
        expect(wrapper).toIncludeText('No results found');
      });
    });
  });
});
