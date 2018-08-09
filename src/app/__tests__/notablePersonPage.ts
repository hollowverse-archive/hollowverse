import {
  TestContext,
  createTestContext,
  assertPageHasReloadButton,
  setUpLogListener,
} from 'helpers/testHelpers';
import {
  pageLoadSucceeded,
  pageLoadFailed,
} from 'store/features/logging/actions';
import {
  notablePersonWithEditorialSummaryQueryResponse,
  stubNotablePersonQueryResponse,
} from 'fixtures/notablePersonQuery';
import { emptyBase64EncodedImage } from 'fixtures/images';
import { last, find } from 'lodash';
import { Action, LogBatch } from 'store/types';

describe('notable person page', () => {
  let context: TestContext;

  describe('when notable person is found,', () => {
    beforeEach(async () => {
      context = await createTestContext({
        mockDataResponsesOverrides: {
          notablePersonQuery: stubNotablePersonQueryResponse,
        },
        createHistoryOptions: { initialEntries: ['/Tom_Hanks'] },
      });
    });

    it('has notable person name', () => {
      expect(document.body).toHaveTextContent('Tom Hanks');
    });

    it('shows related people', () => {
      expect(document.body).toHaveTextContent('Al Pacino');
    });

    describe('logs page load event', () => {
      beforeEach(setUpLogListener);

      it('sends logs on page hide', () => {
        expect(context.dependencies.sendLogs).toHaveBeenLastCalledWith(
          expect.objectContaining({
            actions: expect.arrayContaining([
              {
                ...pageLoadSucceeded({
                  path: context.history.createHref(context.history.location),
                }),
                timestamp: expect.any(Date),
              },
            ]),
          }),
        );
      });
    });

    describe('sends analytics', () => {
      it('loads Google Analytics script', () => {
        expect(
          context.dependencies.getGoogleAnalyticsFunction,
        ).toHaveBeenCalled();
      });

      it('sets the account settings', async () => {
        const ga = await context.dependencies.getGoogleAnalyticsFunction();

        expect(ga).toHaveBeenCalledWith(
          'create',
          expect.stringMatching(/UA-[0-9]{9}-[0-9]{1,2}/g),
          expect.nonEmptyString(),
        );
      });

      it('sets the active page correctly', async () => {
        const ga = await context.dependencies.getGoogleAnalyticsFunction();

        expect(ga).toHaveBeenCalledWith(
          'set',
          'page',
          context.history.location.pathname,
        );
      });

      it('sends pageview event', async () => {
        const ga = await context.dependencies.getGoogleAnalyticsFunction();

        expect(ga).toHaveBeenLastCalledWith(
          'send',
          'pageview',
          context.history.createHref(context.history.location),
        );
      });
    });

    describe('if notable person does not have an editorial summary', () => {
      it('shows a call to comment', () => {
        expect(document.body).toHaveTextContent('Share what you know');
      });
    });

    describe('if notable person has an editorial summary', () => {
      beforeEach(async () => {
        context = await createTestContext({
          mockDataResponsesOverrides: {
            notablePersonQuery: notablePersonWithEditorialSummaryQueryResponse,
          },
          createHistoryOptions: { initialEntries: ['/Tom_Hanks'] },
        });
      });

      it('shows editorial summary content', () => {
        const editorialSummary = document.body.querySelector(
          'main article .editorialSummary',
        );
        expect(editorialSummary).toHaveTextContent('Tom Hanks');
        expect(editorialSummary).toBeDefined();
        expect(editorialSummary).toMatchSnapshot();
      });
    });

    describe('if notable person has an image', () => {
      beforeEach(async () => {
        context = await createTestContext({
          mockDataResponsesOverrides: {
            notablePersonQuery: {
              ...stubNotablePersonQueryResponse,
              notablePerson: {
                ...stubNotablePersonQueryResponse.notablePerson!,
                mainPhoto: {
                  url: emptyBase64EncodedImage,
                  colorPalette: null,
                  sourceUrl:
                    'https://commons.wikimedia.org/wiki/File:Tom_Hanks_2014.jpg',
                },
              },
            },
          },
          createHistoryOptions: { initialEntries: ['/Tom_Hanks'] },
        });
      });

      it('shows notable person image', () => {
        expect(
          document.body.querySelector(`img[src="${emptyBase64EncodedImage}"]`),
        ).toBeDefined();
      });

      it('page includes attribution link', () => {
        expect(
          document.body.querySelector(
            `a[href="https://commons.wikimedia.org/wiki/File:Tom_Hanks_2014.jpg"]`,
          ),
        ).toBeDefined();
      });
    });
  });

  describe('when notable person is not found,', () => {
    beforeEach(async () => {
      context = await createTestContext({
        createHistoryOptions: { initialEntries: ['/Tom_Hanks'] },
        mockDataResponsesOverrides: {
          notablePersonQuery: {
            notablePerson: null,
          },
        },
      });
    });

    it('shows "Not Found"', () => {
      expect(document.body).toHaveTextContent('Not Found');
    });
  });

  describe('on load failure', () => {
    beforeEach(async () => {
      context = await createTestContext({
        createHistoryOptions: { initialEntries: ['/Tom_Hanks'] },
        epicDependenciesOverrides: {
          getResponseForDataRequest: async payload => {
            if (payload.key === 'notablePersonQuery') {
              throw new TypeError('Network error');
            }

            return payload.load();
          },
        },
      });
    });

    it('offers to reload', () => {
      assertPageHasReloadButton(context);
    });

    describe('logs page load failure event', () => {
      beforeEach(setUpLogListener);

      it('sends logs on page hide', () => {
        expect(context.dependencies.sendLogs).toHaveBeenLastCalledWith(
          expect.objectContaining({
            actions: expect.arrayContaining([
              {
                ...pageLoadFailed({
                  path: context.history.createHref(context.history.location),
                  error: expect.objectContaining({
                    message: 'Network error',
                    name: 'TypeError',
                  }),
                }),
                timestamp: expect.any(Date),
              },
            ]),
          }),
        );
      });

      it('log event `error` property is serialized correctly', () => {
        const sendLogs = context.dependencies.sendLogs as jest.Mock<any>;
        const [{ actions }]: LogBatch[] = last(sendLogs.mock.calls)!;
        const action = find(
          actions,
          ({ type }) => type === 'PAGE_LOAD_FAILED',
        ) as Action<'PAGE_LOAD_FAILED'>;

        const error = action.payload.error!;

        expect(JSON.parse(JSON.stringify(error))).toMatchObject(error);
      });
    });
  });

  describe('links to other pages on the website', () => {
    beforeAll(async () => {
      context = await createTestContext({
        createHistoryOptions: { initialEntries: ['/Tom_Hanks'] },
      });
    });

    it('has a link to search page', () => {
      expect(document.body.querySelector('a[href="/search"]')).toBeDefined();
    });
  });
});
