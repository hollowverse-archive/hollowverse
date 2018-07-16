import {
  createClientSideTestContext,
  ClientSideTestContext,
} from 'helpers/testHelpers';
import { getFbSdkAuthState } from 'store/features/auth/reducer';
import { emptyBase64EncodedImage } from 'fixtures/images';
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
        .openAppMenu()
        .find('button')
        .filterWhere(el => !!el.text().match(/log in/i)),
    ).toBeDefined();
  });
});

describe('succesful log in and log out', () => {
  let context: ClientSideTestContext;

  beforeAll(async () => {
    context = await createClientSideTestContext({
      mockDataResponsesOverrides: {
        viewer: {
          viewer: {
            name: 'John Doe',
            photoUrl: emptyBase64EncodedImage,
          },
        },
      },
    });
  });

  it('shows profile data after login', async () => {
    let menu = context.openAppMenu();

    menu
      .find('button')
      .filterWhere(el => !!el.text().match(/log in/i))
      .simulate('click');

    await delay(10);

    menu = context.openAppMenu();

    expect(menu).toIncludeText('John Doe');
    expect(menu.find('img')).toHaveProp('src', emptyBase64EncodedImage);
  });

  it('shows login button after logout', async () => {
    let menu = context.openAppMenu();

    menu
      .find('button')
      .filterWhere(el => !!el.text().match(/log out/i))
      .simulate('click');

    await delay(10);

    menu = context.openAppMenu();

    expect(menu).toIncludeText('Log in');
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

  it('shows error dialog with possible reasons for failure', async () => {
    context
      .openAppMenu()
      .find('button')
      .filterWhere(el => !!el.text().match(/log in/i))
      .simulate('click');

    expect(context.wrapper.find('[role="dialog"]')).toIncludeText(
      'tracking protection',
    );
  });
});
