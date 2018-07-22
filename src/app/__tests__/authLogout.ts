import { createTestContext, TestContext } from 'helpers/testHelpers';
import { emptyBase64EncodedImage } from 'fixtures/images';
import { fireEvent } from 'react-testing-library';

describe('successful log out', () => {
  let context: TestContext;

  beforeEach(async () => {
    context = await createTestContext({
      mockDataResponsesOverrides: {
        viewer: {
          viewer: {
            name: 'John Doe',
            photoUrl: emptyBase64EncodedImage,
          },
        },
      },
    });

    fireEvent.click(await context.toggleAppMenu().getLoginButton());

    fireEvent.click(await context.toggleAppMenu().getLogoutButton());
  });

  it('calls FB.logout', () => {
    expect(FB.logout).toHaveBeenCalled();
  });

  it('shows login button after logout', async () => {
    await context.toggleAppMenu().getLoginButton();
  });
});
