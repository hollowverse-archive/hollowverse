import { createTestContext } from 'helpers/testHelpers';
import { fireEvent } from 'react-testing-library';

describe('night mode', () => {
  it('saves night mode setting when changed', async () => {
    const context = await createTestContext();

    fireEvent.click(context.toggleAppMenu().getNightModeToggle());

    expect(context.dependencies.persistState).toHaveBeenCalledWith(
      expect.objectContaining({
        theme: 'dark',
      }),
    );
  });

  it('restores night mode setting', async () => {
    const context = await createTestContext({
      getPersistedStateToRestore: jest.fn(async () => ({
        theme: 'dark',
      })),
    });

    expect(context.getPersistedStateToRestore).toHaveBeenCalled();
    const toggle = context.toggleAppMenu().getNightModeToggle();

    expect(
      toggle.querySelector<HTMLInputElement>('input[type="checkbox"]')!.checked,
    ).toBe(true);
  });
});
