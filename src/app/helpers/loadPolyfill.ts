import { importGlobalScript } from 'helpers/importGlobalScript';

import intersectionObserverPolyfillUrl from 'file-loader!intersection-observer';
import fetchPolyfillUrl from 'file-loader!whatwg-fetch';

export const loadIntersectionObserverPolyfill = async () => {
  if (__IS_SERVER__) {
    return;
  }

  const supportsIntersectionObserver =
    'IntersectionObserver' in global && 'IntersectionObserverEntry' in global;

  if (!supportsIntersectionObserver) {
    await importGlobalScript(intersectionObserverPolyfillUrl);
  }
};

export const loadFetchPolyfill = async () => {
  if (__IS_SERVER__) {
    return;
  }

  if (!('fetch' in global)) {
    await importGlobalScript(fetchPolyfillUrl);
  }
};
