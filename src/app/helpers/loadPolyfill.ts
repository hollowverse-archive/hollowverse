import { importGlobalScript } from 'helpers/importGlobalScript';

export const loadIntersectionObserverPolyfill = async () => {
  if (__IS_SERVER__) {
    return;
  }

  const supportsIntersectionObserver =
    'IntersectionObserver' in global && 'IntersectionObserverEntry' in global;

  if (!supportsIntersectionObserver) {
    await importGlobalScript(
      'https://cdn.polyfill.io/v2/polyfill.min.js?features=IntersectionObserver',
    );
  }
};

export const loadFetchPolyfill = async () => {
  if (!('fetch' in global)) {
    await import('./fetchPolyfill');
  }
};
