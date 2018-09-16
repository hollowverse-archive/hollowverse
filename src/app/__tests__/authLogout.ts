import {
  createTestContext,
  TestContext,
  attemptLogin,
  attemptLogout,
} from 'helpers/testHelpers';
import { emptyBase64EncodedImage } from 'fixtures/images';

// eslint-disable-next-line jest/no-disabled-tests
describe('successful log out', () => {
  let context: TestContext;

  beforeEach(async () => {
    context = await createTestContext({
      mockDataResponsesOverrides: {
        viewer: {
          viewer: {
            name: 'John Doe',
            photoUrl: emptyBase64EncodedImage,
            role: null,
          },
        },
      },
    });

    await attemptLogin({ context });
    await attemptLogout({ context });
  });

  it('calls FB.logout', () => {
    expect(FB.logout).toHaveBeenCalled();
  });

  it('shows login button after logout', async () => {
    await context.toggleAppMenu().getLoginButton();
  });
});
