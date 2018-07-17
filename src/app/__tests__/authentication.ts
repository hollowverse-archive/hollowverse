import {
  createClientSideTestContext,
  ClientSideTestContext,
} from 'helpers/testHelpers';
import { emptyBase64EncodedImage } from 'fixtures/images';
import { delay } from 'helpers/delay';

afterEach(() => {
  document.querySelector('body')!.innerHTML = '';
});

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

describe('successful log in and log out', () => {
  let context: ClientSideTestContext;
  let menu;

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

    menu = context.toggleAppMenu();

    menu
      .find('button')
      .filterWhere(el => !!el.text().match(/log in/i))
      .simulate('click');

    await delay(10);

    menu = context.toggleAppMenu();
  });

  it('shows profile data after login', async () => {
    expect(menu).toIncludeText('John Doe');
    expect(menu.find('img')).toHaveProp('src', emptyBase64EncodedImage);
  });

  describe('on logout', () => {
    beforeAll(async () => {
      menu = context.toggleAppMenu();
      menu
        .find('button')
        .filterWhere(el => !!el.text().match(/log out/i))
        .simulate('click');
    });

    it('calls FB.logout', () => {
      expect(FB.logout).toHaveBeenCalled();
    });

    it('shows login button after logout', async () => {
      await delay(0);

      menu = context.toggleAppMenu();

      expect(menu).toIncludeText('Log in');
    });
  });
});

describe('failed log in', () => {
  let context: ClientSideTestContext;

  beforeAll(async () => {
    context = await createClientSideTestContext({
      epicDependenciesOverrides: {
        async getResponseForDataRequest(payload) {
          if (payload.key === 'viewer') {
            throw new Error('API error');
          }

          return payload.load();
        },
      },
    });

    context
      .toggleAppMenu()
      .find('button')
      .filterWhere(el => !!el.text().match(/log in/i))
      .simulate('click');

    await delay(1000);
  });

  it('shows error dialog on login button click', async () => {
    expect(
      document.querySelector('[role="alertdialog"]')!.textContent,
    ).toContain('Login failed');
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
