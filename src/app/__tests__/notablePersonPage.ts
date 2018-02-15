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

configure({ adapter: new Adapter() });

describe('Notable Person page', () => {
  let wrapper: ReactWrapper<any>;
  let store: Store<StoreState>;
  let history: History;

  beforeEach(() => {
    history = createMemoryHistory({ initialEntries: ['/Tom_Hanks'] });

    store = createConfiguredStore({
      history,
    }).store;
  });

  describe('When notable person is found,', () => {
    beforeEach(done => {
      const notablePersonQueryResponse: NotablePersonQuery = {
        notablePerson: {
          commentsUrl: '',
          name: 'Tom Hanks',
          editorialSummary: null,
          mainPhoto: null,
          relatedPeople: [
            {
              mainPhoto: null,
              name: 'Al Pacino',
              slug: 'Al_Pacino',
            },
          ],
          slug: 'Tom_Hanks',
          summary: null,
        },
      };

      const tree = createTestTree({
        history,
        store,
        appDependencyOverrides: {
          apiClient: createMockApiClientWithResponse(
            notablePersonQueryResponse,
          ),
        },
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

    it('has notable person name', () => {
      expect(wrapper).toIncludeText('Tom Hanks');
    });

    it('shows related people', () => {
      expect(wrapper).toIncludeText('Al Pacino');
    });
  });

  describe('When notable person is not found,', () => {
    beforeEach(done => {
      const notablePersonQueryResponse: NotablePersonQuery = {
        notablePerson: null,
      };

      const tree = createTestTree({
        history,
        store,
        appDependencyOverrides: {
          apiClient: createMockApiClientWithResponse(
            notablePersonQueryResponse,
          ),
        },
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

    it('shows "Not Found"', () => {
      expect(wrapper).toIncludeText('Not Found');
    });
  });
});
