import {
  createServerSideTestContext,
  ServerSideTestContext,
} from 'helpers/serverTestHelpers';
import { stubNotablePersonQueryResponse } from 'fixtures/notablePersonQuery';
import {
  stubNonEmptySearchResults,
  emptySearchResults,
} from 'fixtures/searchResults';

describe('Server rendering middleware', () => {
  let context: ServerSideTestContext;

  afterEach(() => {
    expect(context.res.text).toBeNonEmptyString();
  });

  describe('Notable Person page', () => {
    beforeEach(async () => {
      context = await createServerSideTestContext({
        path: '/Tom_Hanks',
        mockDataResponsesOverrides: {
          notablePersonQuery: stubNotablePersonQueryResponse,
        },
      });
    });

    describe('When notable person is found', () => {
      it('returns 200', () => {
        expect(context.res.status).toBe(200);
      });
    });

    describe('When notable person is not found', () => {
      beforeEach(async () => {
        context = await createServerSideTestContext({
          path: '/Tom_Hanks',
          mockDataResponsesOverrides: {
            notablePersonQuery: {
              notablePerson: null,
            },
          },
        });
      });

      it('returns 404', () => {
        expect(context.res.status).toBe(404);
      });
    });

    describe('On load failure', () => {
      beforeEach(async () => {
        context = await createServerSideTestContext({
          path: '/Tom_Hanks',
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

      it('returns 500', () => {
        expect(context.res.status).toBe(500);
      });
    });
  });

  describe('Search page', () => {
    describe('When results have finished loading,', () => {
      beforeEach(async () => {
        context = await createServerSideTestContext({
          path: '/search?query=Tom',
          mockDataResponsesOverrides: {
            searchResults: stubNonEmptySearchResults,
          },
        });
      });

      describe('When results are found,', () => {
        it('returns 200', () => {
          expect(context.res.status).toBe(200);
        });
      });

      describe('When no results are found,', () => {
        beforeEach(async () => {
          context = await createServerSideTestContext({
            path: '/search?query=Tom',
            mockDataResponsesOverrides: {
              searchResults: emptySearchResults,
            },
          });
        });

        it('returns 404', () => {
          expect(context.res.status).toBe(404);
        });
      });

      describe('On load failure', () => {
        beforeEach(async () => {
          context = await createServerSideTestContext({
            path: '/search?query=Tom',
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

        it('returns 500', () => {
          expect(context.res.status).toBe(500);
        });
      });
    });
  });
});
