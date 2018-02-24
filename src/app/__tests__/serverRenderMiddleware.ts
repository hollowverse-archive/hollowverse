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
    });

    describe('When notable person is found', () => {
      it('returns 200', () => {
        expect(context.res.status).toBe(200);
      });

      it('has body', () => {
        expect(context.res.text).toBeNonEmptyString();
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

      it('has body', () => {
        expect(context.res.text).toBeNonEmptyString();
      });

      it('shows "Not Found"', () => {
        expect(context.$('body').text()).toContain('Not Found');
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

        it('shows a list of results', () => {
          expect(context.$('body').text()).toContain('Tom Hanks');
          expect(context.$('body').text()).toContain('Tom Hardy');
        });

        it('results link to the respective notable person page', () => {
          context
            .$('body')
            .find('li')
            .each((_, li) => {
              const $li = context.$(li);
              for (const result of stubNonEmptySearchResults.hits) {
                if ($li.text().includes(result.name)) {
                  const $a = $li.find('a');
                  expect($a.attr('href')).toContain(result.slug);
                }
              }
            });
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

        it('shows "No results found"', () => {
          expect(context.$('body').text()).toContain('No results found');
        });
      });
    });
  });
});
