import {
  ClientSideTestContext,
  createClientSideTestContext,
} from 'helpers/testHelpers';
import { pageLoadSucceeded } from 'store/features/logging/actions';
import {
  notablePersonWithEditorialSummaryQueryResponse,
  stubNotablePersonQueryResponse,
} from 'fixtures/notablePersonQuery';
import { EditorialSummary } from 'components/EditorialSummary/EditorialSummary';

const emptyBase64EncodedImage =
  'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';

describe('Notable Person page', () => {
  let context: ClientSideTestContext;

  describe('When notable person is found,', () => {
    beforeEach(async () => {
      context = await createClientSideTestContext({
        mockDataResponsesOverrides: {
          notablePersonQuery: stubNotablePersonQueryResponse,
        },
        createHistoryOptions: { initialEntries: ['/Tom_Hanks'] },
      });
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
        expect(context.wrapper).toIncludeText('Share what you know');
      });
    });

    describe('if notable person has an editorial summary', () => {
      beforeEach(async () => {
        context = await createClientSideTestContext({
          mockDataResponsesOverrides: {
            notablePersonQuery: notablePersonWithEditorialSummaryQueryResponse,
          },
          createHistoryOptions: { initialEntries: ['/Tom_Hanks'] },
        });
      });

      it('shows editorial summary content', () => {
        const editorialSummary = context.wrapper.find(EditorialSummary);
        expect(editorialSummary).toBePresent();
        expect(editorialSummary).toMatchSnapshot();
      });
    });

    describe('if notable person has an image', () => {
      beforeEach(async () => {
        context = await createClientSideTestContext({
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
          context.wrapper.find(`img[src="${emptyBase64EncodedImage}"]`),
        ).toBePresent();
      });

      it('page includes attribution link', () => {
        expect(
          context.wrapper.find(
            `a[href="https://commons.wikimedia.org/wiki/File:Tom_Hanks_2014.jpg"]`,
          ),
        ).toBePresent();
      });
    });
  });

  describe('When notable person is not found,', () => {
    beforeEach(async () => {
      context = await createClientSideTestContext({
        createHistoryOptions: { initialEntries: ['/Tom_Hanks'] },
        mockDataResponsesOverrides: {
          notablePersonQuery: {
            notablePerson: null,
          },
        },
      });
    });

    it('shows "Not Found"', () => {
      expect(context.wrapper).toIncludeText('Not Found');
    });
  });

  describe('On load failure', () => {
    beforeEach(async () => {
      context = await createClientSideTestContext({
        createHistoryOptions: { initialEntries: ['/Tom_Hanks'] },
        epicDependenciesOverrides: {
          getResponseForDataRequest: async payload => {
            if (payload.key === 'notablePersonQuery') {
              throw new TypeError();
            }

            return payload.load();
          },
        },
      });
    });

    it('offers to reload', () => {
      const linkButton = context.wrapper.findWhere(
        el => el.is('a') && Boolean(el.text().match(/reload/i)),
      );
      expect(linkButton).toBePresent();
      expect(linkButton.render().attr('href')).toMatch('/Tom_Hanks');
    });
  });

  describe('Links to other pages on the website', () => {
    beforeAll(async () => {
      context = await createClientSideTestContext({
        createHistoryOptions: { initialEntries: ['/Tom_Hanks'] },
      });
    });

    it('has a link to search page', () => {
      expect(context.wrapper.find('a[href="/search"]')).toBePresent();
    });
  });
});
