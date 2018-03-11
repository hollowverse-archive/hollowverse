/**
 * The following global constants are defined using Webpack's `DefinePlugin`
 * and are available for use anywhere in the app code.
 */

/** Whether the `DEBUG` flag has been passed to the CLI start command */
declare const __IS_DEBUG__: boolean;

/**
 * `true` if the code is running in Node.js (server-side rendering),
 * `false` otherwise
 */
declare const __IS_SERVER__: boolean;

/** Git branch of the current build, or `undefined` for development */
declare const __BRANCH__: string | undefined;

/** Git commit hash of the current build, or `undefined` for development */
declare const __COMMIT_ID__: string | undefined;

/**
 * The base URL of the current app server,
 * i.e. https://hollowvese.com for production or
 * http://localhost:3001 for development
 */
declare const __BASE__: string;

/** @example https://api.hollowverse.com/graphql */
declare const __API_ENDPOINT__: string;

/**
 * By default, logging and analytics are disabled in development.
 * Run `FORCE_ENABLE_LOGGING=1 yarn dev` to set this to `true` and force enable logging.
 */
declare const __FORCE_ENABLE_LOGGING__: boolean;
