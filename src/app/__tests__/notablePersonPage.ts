import 'expect-more-jest';
import 'jest-enzyme';
import {
  createConfiguredStore,
  EpicDependencies,
} from 'store/createConfiguredStore';
import createMemoryHistory from 'history/createMemoryHistory';
import { getStatusCode } from 'store/features/status/reducer';
import { configure, mount, ReactWrapper } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { createTestTree } from 'helpers/testHelpers';
import { NotablePersonQuery } from 'api/types';
import { Store } from 'redux';
import { StoreState } from 'store/types';
import { History } from 'history';
import { pageLoadSucceeded } from 'store/features/logging/actions';

configure({ adapter: new Adapter() });

describe('Notable Person page', () => {
  let wrapper: ReactWrapper<any>;
  let store: Store<StoreState>;
  let history: History;

  // @ts-ignore
  let sendLogs: EpicDependencies['sendLogs'];

  beforeEach(() => {
    expect.hasAssertions();
    history = createMemoryHistory({ initialEntries: ['/Tom_Hanks'] });
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

      store = createConfiguredStore({
        history,
        dependencyOverrides: {
          async getResponseForDataRequest(payload) {
            if (payload.key === 'notablePersonQuery') {
              return notablePersonQueryResponse;
            }

            return payload.load();
          },

          sendLogs,
        },
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

    it('has notable person name', () => {
      expect(wrapper).toIncludeText('Tom Hanks');
    });

    it('shows related people', () => {
      expect(wrapper).toIncludeText('Al Pacino');
    });

    describe('logs page load event', () => {
      beforeEach(done => {
        sendLogs = jest.fn();

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

        store = createConfiguredStore({
          history,
          dependencyOverrides: {
            async getResponseForDataRequest(payload) {
              if (payload.key === 'notablePersonQuery') {
                return notablePersonQueryResponse;
              }

              return payload.load();
            },

            sendLogs,
          },
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

      beforeEach(done => {
        window.addEventListener('unload', () => {
          done();
        });

        window.dispatchEvent(new Event('unload'));
      });

      it('sends logs on page unload', () => {
        expect.hasAssertions();
        expect(sendLogs).toHaveBeenLastCalledWith([
          pageLoadSucceeded(history.createHref(history.location)),
        ]);
      });
    });
  });

  describe('When notable person is not found,', () => {
    beforeEach(done => {
      const notablePersonQueryResponse: NotablePersonQuery = {
        notablePerson: null,
      };

      store = createConfiguredStore({
        history,
        dependencyOverrides: {
          async getResponseForDataRequest(payload) {
            if (payload.key === 'notablePersonQuery') {
              return notablePersonQueryResponse;
            }

            return payload.load();
          },
        },
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

    it('shows "Not Found"', () => {
      expect(wrapper).toIncludeText('Not Found');
    });
  });
});
