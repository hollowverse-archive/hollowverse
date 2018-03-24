import pathToRegExp from 'path-to-regexp';

/**
 * A map of old slugs to new slugs that are explicitly set to be redirected
 * to the new website.
 */
export const redirectionMap = new Map<string, string>([
  ['/tom-hanks', '/Tom_Hanks'],
  ['/michael-jordan', '/Michael_Jordan'],
  ['/shahid-kapoor', '/Shahid_Kapoor'],
  ['/taylor-swift', '/Taylor_Swift'],
  ['/leonardo-dicaprio', '/Leonardo_DiCaprio'],
  ['/joseph-stalin', '/Joseph_Stalin'],
  ['/will-smith', '/Will_Smith'],
  ['/morgan-freeman', '/Morgan_Freeman'],
  ['/jamie-foxx', '/Jamie_Foxx'],
  ['/robert-downey-jr', '/Robert_Downey_Jr.'],
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
