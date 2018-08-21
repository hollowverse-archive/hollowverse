import { createTestContext, TestContext } from 'helpers/testHelpers';
import { fireEvent } from 'react-testing-library';

// eslint-disable-next-line jest/no-disabled-tests
describe.skip('authentication', () => {
  let context: TestContext;

  beforeEach(async () => {
    context = await createTestContext();
  });

  it('tries to load FB SDK', () => {
    expect(context.dependencies.getFbSdk).toHaveBeenCalled();
  });

  it('listens for FB SDK auth changes', async () => {
    const fbSdk = await context.dependencies.getFbSdk();

    expect(fbSdk.Event.subscribe).toHaveBeenCalledWith(
      'auth.authResponseChange',
      expect.any(Function),
    );
  });

  it('shows login button', async () => {
    await context.toggleAppMenu().getLoginButton();
  });
});

// eslint-disable-next-line jest/no-disabled-tests
describe.skip('on FB SDK initialization failure', () => {
  let context: TestContext;

  beforeEach(async () => {
    context = await createTestContext({
      epicDependenciesOverrides: {
        async getFbSdk() {
          throw new Error('Script failed to load');
        },
      },
    });
  });

  it('shows error dialog with possible reasons for failure', async () => {
    fireEvent.click(await context.toggleAppMenu().getLoginButton());

    expect(document.querySelector('[role="alertdialog"]')).toHaveTextContent(
      'tracking protection',
    );
  });
});
