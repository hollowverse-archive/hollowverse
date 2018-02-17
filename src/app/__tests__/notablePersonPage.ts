import { getStatusCode } from 'store/features/status/reducer';
import {
  createMockGetResponseForDataRequest,
  TestContext,
  createTestContext,
} from 'helpers/testHelpers';
import { pageLoadSucceeded } from 'store/features/logging/actions';

describe('Notable Person page', () => {
  let context: TestContext;

  describe('When notable person is found,', () => {
    beforeEach(async () => {
      context = await createTestContext({
        epicDependenciesOverrides: {
          getResponseForDataRequest: createMockGetResponseForDataRequest(
            'notablePersonQuery',
            {
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
            },
          ),
        },
        createHistoryOptions: { initialEntries: ['/Tom_Hanks'] },
      });
    });

    it('returns 200', () => {
      expect(getStatusCode(context.store.getState())).toBe(200);
    });

    it('has notable person name', () => {
      expect(context.wrapper).toIncludeText('Tom Hanks');
    });

    it('shows related people', () => {
      expect(context.wrapper).toIncludeText('Al Pacino');
    });

    describe('logs page load event', () => {
      beforeEach(done => {
        window.addEventListener('unload', () => {
          done();
        });

        window.dispatchEvent(new Event('unload'));
      });

      it('sends logs on page unload', () => {
        expect(context.dependencies.sendLogs).toHaveBeenLastCalledWith(
          expect.arrayContaining([
            pageLoadSucceeded(
              context.history.createHref(context.history.location),
            ),
          ]),
        );
      });
    });
  });

  describe('When notable person is not found,', () => {
    beforeEach(async () => {
      context = await createTestContext({
        createHistoryOptions: { initialEntries: ['/Tom_Hanks'] },
        epicDependenciesOverrides: {
          getResponseForDataRequest: createMockGetResponseForDataRequest(
            'notablePersonQuery',
            {
              notablePerson: null,
            },
          ),
        },
      });
    });

    it('returns 404', () => {
      expect(getStatusCode(context.store.getState())).toBe(404);
    });

    it('shows "Not Found"', () => {
      expect(context.wrapper).toIncludeText('Not Found');
    });
  });
});
