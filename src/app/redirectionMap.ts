/**
 * A map of old slugs to new slugs that are explicitly set to be redirected
 * to the new website.
 */
export const redirectionMap = new Map<string, string>([
  ['tom-hanks', 'Tom_Hanks'],
]);

/** A whitelist of pages on the new app that can be accessed directly via the URL */
export const whitelistedNewPaths = new Set([
  ...Array.from(redirectionMap.values()),
  'search',
]);
