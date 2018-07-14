import {
  createClientSideTestContext,
  ClientSideTestContext,
} from 'helpers/testHelpers';
import { getFbSdkAuthState } from 'store/features/auth/reducer';

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
        .openAppMenu()
        .find('button')
        .filterWhere(el => !!el.text().match(/log in/i)),
    ).toBeDefined();
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

  it('error state is handled', () => {
    expect(getFbSdkAuthState(context.store.getState())).toMatchObject({
      state: 'error',
    });
  });
});
