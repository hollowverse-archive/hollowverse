import {
  createClientSideTestContext,
  ClientSideTestContext,
} from 'helpers/testHelpers';
import { delay } from 'helpers/delay';
import { fireEvent } from 'react-testing-library';

describe('authentication', () => {
  let context: ClientSideTestContext;

  beforeEach(async () => {
    context = await createClientSideTestContext();
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

describe('on FB SDK initialization failure', () => {
  let context: ClientSideTestContext;

  beforeEach(async () => {
    context = await createClientSideTestContext({
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
