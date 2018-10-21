import {
  createTestContext,
  TestContext,
  attemptLogin,
} from 'helpers/testHelpers';
import { emptyBase64EncodedImage } from 'fixtures/images';
import 'jest-dom/extend-expect';

// eslint-disable-next-line jest/no-disabled-tests
describe('successful log in', () => {
  let context: TestContext;

  beforeEach(async () => {
    context = await createTestContext({
      mockDataResponsesOverrides: {
        viewer: {
          viewer: {
            name: 'John Doe',
            photoUrl: emptyBase64EncodedImage,
            role: null,
          },
        },
      },
    });

    await attemptLogin({ context });
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

// eslint-disable-next-line jest/no-disabled-tests
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

    await attemptLogin({ context, waitUntilComplete: false });
  });

  it('shows error message', () => {
    expect(document.querySelector('[role="alertdialog"]')).toHaveTextContent(
      'Login failed',
    );
  });
});
