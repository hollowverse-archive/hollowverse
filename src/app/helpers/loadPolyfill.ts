import { importGlobalScript } from 'helpers/importGlobalScript';

// `file-loader` instructs Webpack to output the imported module to a separate
// file, and returns the runtime URL of that file so that we can import it
// as a global script.
// Polyfills must be imported as global scripts because they need to access things
// like `window` and `global`.
import intersectionObserverPolyfillUrl from 'file-loader!uglify-loader!intersection-observer';
import fetchPolyfillUrl from 'file-loader!uglify-loader!whatwg-fetch';
import urlPolyfillUrl from 'file-loader!uglify-loader!url-polyfill';

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

export const loadUrlPolyfill = async () => {
  if (!('URL' in global) || !('URLSearchParams' in global)) {
    await importGlobalScript(urlPolyfillUrl);
  }
};
