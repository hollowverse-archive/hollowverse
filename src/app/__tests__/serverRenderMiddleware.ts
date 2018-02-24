import {
  createServerSideTestContext,
  ServerSideTestContext,
} from 'helpers/serverTestHelpers';
import { createMockGetResponseForDataRequest } from 'helpers/testHelpers';
import { stubNotablePersonQueryResponse } from 'fixtures/notablePersonQuery';
import {
  stubNonEmptySearchResults,
  emptySearchResults,
} from 'fixtures/searchResults';

describe('Server rendering middleware', () => {
  let context: ServerSideTestContext;

  describe('Notable Person page', () => {
    beforeEach(async () => {
      context = await createServerSideTestContext({
        path: '/Tom_Hanks',
        epicDependenciesOverrides: {
          getResponseForDataRequest: createMockGetResponseForDataRequest(
            'notablePersonQuery',
            stubNotablePersonQueryResponse,
          ),
        },
      });

      expect(context.res.text).toBeNonEmptyString();
    });

    describe('When notable person is found', () => {
      it('returns 200', () => {
        expect(context.res.status).toBe(200);
      });

      it('has notable person name', () => {
        expect(
          context
            .$('body')
            .find('h1')
            .text(),
        ).toContain('Tom Hanks');
      });

      it('shows related people', () => {
        expect(context.$('body').text()).toContain('Al Pacino');
      });
    });

    describe('When notable person is not found', () => {
      beforeEach(async () => {
        context = await createServerSideTestContext({
          path: '/Tom_Hanks',
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
        expect(context.res.status).toBe(404);
      });
    });
  });

  describe('Search page', () => {
    describe('When results have finished loading,', () => {
      beforeEach(async () => {
        context = await createServerSideTestContext({
          path: '/search?query=Tom',
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
          expect(context.res.status).toBe(200);
        });
      });

      describe('When no results are found,', () => {
        beforeEach(async () => {
          context = await createServerSideTestContext({
            path: '/search?query=Tom',
            epicDependenciesOverrides: {
              getResponseForDataRequest: createMockGetResponseForDataRequest(
                'searchResults',
                emptySearchResults,
              ),
            },
          });
        });

        it('returns 404', () => {
          expect(context.res.status).toBe(404);
        });
      });
    });
  });
});
