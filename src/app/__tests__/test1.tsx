import 'expect-more-jest';
import { createConfiguredStore, defaultInitialState } from 'store/createConfiguredStore';
import createMemoryHistory from 'history/createMemoryHistory';
import { getStatusCode } from 'store/features/status/reducer';
import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { createTestTree } from 'helpers/testHelpers';

configure({ adapter: new Adapter });

describe('Testing tests', () => {
  it('Notable Person page returns 200, displays NP details when found', async () => {
    expect.hasAssertions();

    const history = createMemoryHistory({ initialEntries: ['/Tom_Hanks'] });
    const notablePersonQueryResponse = {
      notablePerson: {
        commentsUrl: '',
        name: 'Tom Hanks',
        editorialSummary: null,
        mainPhoto: null,
        relatedPeople: [],
        slug: 'Tom_Hanks',
        summary: null,
      },
    };
  
    const { store } = createConfiguredStore({
      history,
      initialState: {
        ...defaultInitialState,
        resolvedData: {
          ...defaultInitialState.resolvedData,
          notablePersonQuery: {
            hasError: false,
            isInProgress: false,
            requestId: 'Tom_Hanks',
            value: notablePersonQueryResponse,
          },
        }
      },
    });

    const tree = createTestTree({ history, store });

    const wrapper = mount(tree);

    expect(wrapper.contains('Tom Hanks')).toBe(true);
    expect(getStatusCode(store.getState())).toBe(200);
  });
});
