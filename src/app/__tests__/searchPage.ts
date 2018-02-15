import 'expect-more-jest';
import 'jest-enzyme';
import { createConfiguredStore } from 'store/createConfiguredStore';
import createMemoryHistory from 'history/createMemoryHistory';
import { getStatusCode } from 'store/features/status/reducer';
import { configure, mount, ReactWrapper } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import {
  createTestTree,
  createMockApiClientWithResponse,
} from 'helpers/testHelpers';
import { NotablePersonQuery } from 'api/types';
import { Store } from 'redux';
import { StoreState } from 'store/types';
import { History } from 'history';
import { AlgoliaResponse } from 'algoliasearch';

configure({ adapter: new Adapter() });

describe('Search page', () => {
  let wrapper: ReactWrapper<any>;
  let store: Store<StoreState>;
  let history: History;
  let searchResults: AlgoliaResponse;

  describe('While typing,', () => {
    it('updates the URL to match the search query');
  });

  describe('While results are being loaded,', () => {
    it('indicates loading status');
  });

  describe('When results have finished loading,', () => {
    beforeEach(() => {
      history = createMemoryHistory({ initialEntries: ['/search?query=Tom'] });
    });

    describe('When results are found,', () => {
      beforeEach(done => {
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
          query: 'Tom'
        };
  
        store = createConfiguredStore({
          history,
          dependencyOverrides: {
            async getResponseForDataRequest(payload) {
              if (payload.key === 'searchResults') {
                return searchResults;
              }
  
              return payload.load();
            },
          }
        }).store;
  
        const tree = createTestTree({
          history,
          store,
        });
  
        wrapper = mount(tree);
  
        setTimeout(() => {
          wrapper.update();
          done();
        }, 0);
      });
  
      it('returns 200', () => {
        expect(getStatusCode(store.getState())).toBe(200);
      });
  
      it('shows a list of results', () => {
        expect(wrapper).toIncludeText('Tom Hanks');
        expect(wrapper).toIncludeText('Tom Hardy');
      });
  
      it('results link to the respective notable person page', () => {
        expect.hasAssertions();
  
        wrapper.findWhere(w => w.is('li')).forEach(li => {
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
      beforeEach(done => {
        searchResults = {
          hits: [
            
          ],
          hitsPerPage: 10,
          nbHits: 0,
          nbPages: 1,
          page: 0,
          params: '',
          processingTimeMS: 1,
          query: 'Tom'
        };
  
        store = createConfiguredStore({
          history,
          dependencyOverrides: {
            async getResponseForDataRequest(payload) {
              if (payload.key === 'searchResults') {
                return searchResults;
              }
  
              return payload.load();
            },
          }
        }).store;
  
        const tree = createTestTree({
          history,
          store,
        });
  
        wrapper = mount(tree);
  
        setTimeout(() => {
          wrapper.update();
          done();
        }, 0);
      });
  
      it('returns 404', () => {
        expect(getStatusCode(store.getState())).toBe(404);
      });
  
      it('shows "Not results found"', () => {
        expect(wrapper).toIncludeText('No results found');
      });
    });
  });
});
