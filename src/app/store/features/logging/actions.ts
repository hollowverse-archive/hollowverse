import { createActionCreator } from 'store/helpers';

export const unhanldedErrorThrown = createActionCreator(
  'UNHANDLED_ERROR_THROWN',
);

export const urlClicked = createActionCreator('URL_CLICKED');

export const pageRenderStarted = createActionCreator('PAGE_RENDER_STARTED');
export const pageLoadSucceeded = createActionCreator('PAGE_LOAD_SUCCEEDED');
export const pageLoadFailed = createActionCreator('PAGE_LOAD_FAILED');
