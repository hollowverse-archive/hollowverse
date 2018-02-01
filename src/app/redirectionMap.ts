import * as pathToRegExp from 'path-to-regexp';

/**
 * A map of old slugs to new slugs that are explicitly set to be redirected
 * to the new website.
 */
export const redirectionMap = new Map<string, string>([
  ['/tom-hanks', '/Tom_Hanks'],
]);

export const whitelistedNewPaths = [
  ...Array.from(redirectionMap.values()),
  '/search',
  // tslint:disable-next-line:no-unnecessary-callback-wrapper
].map(path => pathToRegExp(path));

/** Determines whether a page on the new app can be accessed directly via the URL */
export const isWhitelistedPage = (path: string) => {
  return whitelistedNewPaths.some(regExp => regExp.test(path));
};
