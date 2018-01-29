/**
 * A map of old slugs to new slugs that are explicitly set to be redirected
 * to the new website.
 */
export const redirectionMap = new Map<string, string>([
  ['tom-hanks', 'Tom_Hanks'],
]);

/** A set of new slugs of pages that are explicitly redirected to the new website */
export const whitelistedNewPaths = new Set(redirectionMap.values());
