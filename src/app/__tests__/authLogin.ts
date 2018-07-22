import { createTestContext, TestContext } from 'helpers/testHelpers';
import { emptyBase64EncodedImage } from 'fixtures/images';
import { fireEvent } from 'react-testing-library';
import 'jest-dom/extend-expect';

describe('successful log in', () => {
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
    await context.toggleAppMenu().getLogoutButton();
  });

  it('shows profile data after login', async () => {
    const menu = context.toggleAppMenu();
    expect(menu).toHaveTextContent('John Doe');
    expect(menu.querySelector('img')).toHaveAttribute(
      'src',
      emptyBase64EncodedImage,
    );
  });
});

describe('failed log in', () => {
  let context: TestContext;

  beforeEach(async () => {
    context = await createTestContext({
      epicDependenciesOverrides: {
        async getResponseForDataRequest(payload) {
          if (payload.key === 'viewer') {
            throw new Error('API error');
          }

          return payload.load();
        },
      },
    });

    fireEvent.click(await context.toggleAppMenu().getLoginButton());
  });

  it('shows error message', () => {
    expect(document.querySelector('[role="alertdialog"]')).toHaveTextContent(
      'Login failed',
    );
  });
});
