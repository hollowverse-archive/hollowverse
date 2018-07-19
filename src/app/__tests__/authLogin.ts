import {
  createClientSideTestContext,
  ClientSideTestContext,
} from 'helpers/testHelpers';
import { emptyBase64EncodedImage } from 'fixtures/images';
import { delay } from 'helpers/delay';

afterEach(() => {
  Array.from(document.body.childNodes).forEach(child => {
    child.remove();
  });
});

describe('successful log in', () => {
  let context: ClientSideTestContext;
  let menu: ReturnType<typeof context['toggleAppMenu']>;

  beforeEach(async () => {
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

    await delay(10);

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
});

describe('failed log in', () => {
  let context: ClientSideTestContext;

  beforeEach(async () => {
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

    await delay(10);
  });

  it('shows error message', async () => {
    expect(
      document.querySelector('[role="alertdialog"]')!.textContent,
    ).toContain('Login failed');
  });
});
