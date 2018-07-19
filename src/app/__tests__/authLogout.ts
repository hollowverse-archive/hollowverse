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

describe('successful log out', () => {
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

    await delay(10);
    menu = context.toggleAppMenu();

    menu
      .find('button')
      .filterWhere(el => !!el.text().match(/log in/i))
      .simulate('click');

    await delay(10);
    menu = context.toggleAppMenu();

    menu
      .find('button')
      .filterWhere(el => !!el.text().match(/log out/i))
      .simulate('click');

    await delay(100);

    menu = context.toggleAppMenu();
  });

  it('calls FB.logout', () => {
    expect(FB.logout).toHaveBeenCalled();
  });

  it('shows login button after logout', () => {
    expect(menu).toIncludeText('Log in');
  });
});
