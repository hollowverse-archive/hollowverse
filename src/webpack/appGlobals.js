const {
  isDebug,
  isProd,
  isTest,
  parseBooleanEnvVariable,
} = require('@hollowverse/utils/helpers/env');

module.exports.getAppGlobals = () => ({
  __FORCE_ENABLE_LOGGING__:
    isTest || parseBooleanEnvVariable(process.env.FORCE_ENABLE_LOGGING),
  __IS_DEBUG__: isDebug,
  __BRANCH__: isTest ? 'test' : process.env.BRANCH,
  __COMMIT_ID__: isTest ? '123456' : process.env.COMMIT_ID,
  __BASE__: isProd
    ? 'https://hollowverse.com'
    : `http://localhost:${process.env.APP_SERVER_PORT || 3001}`,
  // To avoid issues with cross-origin requests in development,
  // the API endpoint is mapped to an endpoint on the same origin
  // which proxies the requests to the actual defined endpoint
  // The proxy is defined in appServer.ts
  __API_ENDPOINT__: isProd ? process.env.API_ENDPOINT : '/__api',
});
