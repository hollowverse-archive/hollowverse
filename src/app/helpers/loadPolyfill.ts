export const loadIntersectionObserverPolyfill = async () => {
  const supportsIntersectionObserver =
    'IntersectionObserver' in global &&
    'IntersectionObserverEntry' in global &&
    'intersectionRatio' in IntersectionObserverEntry.prototype;

  if (!supportsIntersectionObserver) {
    await import('intersection-observer');
  }
};
