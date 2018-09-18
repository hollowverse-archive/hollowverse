import {
  createTestContext,
  TestContext,
  attemptLogout,
  attemptLogin,
} from 'helpers/testHelpers';
import { UserRole } from 'api/types';
import { waitForElement, queryByText } from 'react-testing-library';
import { plural } from 'pluralize';
import { delay } from 'helpers/delay';

const getFailureDialog = () => {
  return queryByText(
    document.body,
    (_text, el) => Boolean(el.textContent!.match(/fail|access|allow/i)),
    {
      selector: '[role="alertdialog"]',
    },
  );
};

describe('protected pages are inaccessible for users with unmatching roles', () => {
  describe.each([['/moderation', [UserRole.MODERATOR]]])(
    '%s is only accessible to %s',
    (path: string, validRoles: UserRole[]) => {
      let context: TestContext;
      const invalidRoles = Object.values(UserRole).filter(
        role => !validRoles.includes(role),
      );

      const cannotAccess = async () => {
        expect(
          await waitForElement(getFailureDialog, { timeout: 1000 }),
        ).toHaveTextContent(/not allowed/);
      };

      const canAccess = async () => {
        await delay(1000);
        expect(getFailureDialog()).toBe(null);
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
      ])(
        '%s',
        async (_: string, role: UserRole, assert: () => Promise<void>) => {
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

          await assert();

          await attemptLogout({ context });
        },
      );
    },
  );
});
