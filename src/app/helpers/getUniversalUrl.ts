/**
 * Unlike browsers, Node.js has no idea what the domain
 * of the server is, so all URLs must be absolute.
 *
 * This helper function returns a fully qualified URL on server, and a
 * relative URL on the client.
 *
 * **Example**: Given a value `"/log"` for the `path` parameter,
 * this function returns `"https://hollowverse.com/log"` on the server
 * and `"/log"` on the client.
 *
 * While we could of course return a full URL on the client as well,
 * a relative URL works better in development environments.
 *
 * Note: it's safe to use this with absolute URLs,
 * i.e. if you pass `https://example.com/example`, it
 * would be returned as-is.
 */
export function getUniversalUrl(path: string) {
  if (__IS_SERVER__) {
    return String(new URL(path, __BASE__));
  }

  // This is intentionally not wrapped in `URL` constructor
  // because of an issue in Safari `URL` implementation
  return path;
}
