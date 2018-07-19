import {
  createClientSideTestContext,
  ClientSideTestContext,
} from 'helpers/testHelpers';
import { delay } from 'helpers/delay';

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
    expect(
      context
        .toggleAppMenu()
        .find('button')
        .filterWhere(el => !!el.text().match(/log in/i)),
    ).toBeDefined();
  });
});

describe('on FB SDK initialization failure', () => {
  let context: ClientSideTestContext;

  beforeAll(async () => {
    context = await createClientSideTestContext({
      epicDependenciesOverrides: {
        async getFbSdk() {
          throw new Error('Script failed to load');
        },
      },
    });

    await delay(10);
  });

  it('shows error dialog with possible reasons for failure', async () => {
    context
      .toggleAppMenu()
      .find('button')
      .filterWhere(el => !!el.text().match(/log in/i))
      .simulate('click');

    expect(
      document.querySelector('[role="alertdialog"]')!.textContent,
    ).toContain('tracking protection');
  });
});
