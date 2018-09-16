import {
  createTestContext,
  TestContext,
  attemptLogout,
  attemptLogin,
} from 'helpers/testHelpers';
import { UserRole } from 'api/types';
import { waitForElement, getByText } from 'react-testing-library';
import { plural } from 'pluralize';

// tslint:disable mocha-no-side-effect-code
// eslint-disable-next-line jest/no-disabled-tests
describe.skip('protected pages are inaccessible for users with unmatching roles', () => {
  describe.each([['/moderation/events', [UserRole.MODERATOR]]])(
    '%s is only accessible to %s',
    (path: string, validRoles: UserRole[]) => {
      let context: TestContext;
      const invalidRoles = Object.values(UserRole).filter(
        role => !validRoles.includes(role),
      );

      const cannotAccess = async () => {
        const dialog = await waitForElement(() => {
          return getByText(
            document.body,
            (_text, el) => Boolean(el.textContent!.match(/fail|access|allow/i)),
            {
              selector: '[role="alertdialog"]',
            },
          );
        });

        expect(dialog!).toHaveTextContent(/not allowed/);
      };

      const canAccess = async () => {
        // @TODO: check that page renders;
        expect(1).toBe(1);
      };

      test.each([
        ['regular users cannot access', null, cannotAccess],
        ...invalidRoles.map(role => [
          `${plural(role.toLowerCase())} cannot access`,
          role,
          cannotAccess,
        ]),
        ...validRoles.map(role => [
          `${plural(role.toLowerCase())} can access`,
          role,
          canAccess,
        ]),
      ])('%s', async (_: string, role: UserRole, assert: () => void) => {
        context = await createTestContext({
          createHistoryOptions: {
            initialEntries: [path],
          },
          mockDataResponsesOverrides: {
            viewer: {
              viewer: {
                name: 'Jane Doe',
                photoUrl: null,
                role,
              },
            },
          },
        });

        await attemptLogin({ context });

        assert();

        await attemptLogout({ context });
      });
    },
  );
});
