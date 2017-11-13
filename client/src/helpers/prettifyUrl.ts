/**
 * Removes the protocol and path of a URL. Subdomains other than `www` are not removed.
 *
 * Examples:
 *
 * URL                               | Result
 * ----------------------------------|------------
 * https://example.com/page/1243     | example.com
 * https://sub.example.com/page/1243 | sub.example.com
 * https://www.example.com/page/1243 | example.com
 * @param url The full URL to prettify, e.g. https://example.com/page/1243
 */
export const prettifyUrl = (url: string) =>
  new URL(url).hostname.replace(/^www\./i, '');
