import { createActionCreator } from 'store/helpers';

export const unhanldedErrorThrown = createActionCreator(
  'UNHANDLED_ERROR_THROWN',
);

export const pageLoadSucceeded = createActionCreator('PAGE_LOAD_SUCCEEDED');

export const pageLoadFailed = createActionCreator('PAGE_LOAD_FAILED');

export const pageRedirected = createActionCreator('PAGE_REDIRECTED');

export const notablePersonVisitedThroughSearch = createActionCreator(
  'NOTABLE_PERSON_VISITED_THROUGH_SEARCH',
);
