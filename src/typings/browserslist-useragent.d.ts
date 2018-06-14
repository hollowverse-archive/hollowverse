declare module 'browserslist-useragent' {
  type Options = {
    /**
     * Manually provide a browserslist query (or an array of queries).
     * Specifying this overrides the browserslist configuration specified
     * in your project.
     */
    browsers?: string[];

    /**
     * When multiple browserslist enviroments are specified,
     * pick the config belonging to this environment.
     */
    env?: string;

    /**
     * Ignore differences in patch browser numbers
     *
     * @default true
     */
    ignorePatch?: boolean;

    /**
     * Ignore differences in minor browser versions
     *
     * @default false
     */
    ignoreMinor?: boolean;

    /**
     * In case you're unable to keep this package up-to-date, you can set the
     * `_allowHigherVersions` to `true`.
     * For all the browsers specified in your browserslist query,
     * this will return a match if the user agent version is equal to or
     * higher than those specified in your browserslist query. Use this
     * with care though, since it's a wildcard, and only lightly tested.
     */
    _allowHigherVersions?: boolean;
  };

  export function matchesUA(userAgent: string, options: Options): boolean;

  export function resolveUserAgent(
    userAgent: string,
  ): { family: string; version: string };

  export function normalizeQuery(query: string): string;
}
