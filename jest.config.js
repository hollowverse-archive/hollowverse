const { createBabelConfig } = require('./src/webpack/babel');
const { isProd, isDebug } = require('./src/webpack/env');

module.exports = {
  globals: {
    __IS_SERVER__: false,

    // This won't actually send any logs or analytics, it's enabled
    // to test the mock implementations of the logging functions.
    __FORCE_ENABLE_LOGGING__: true,
    __IS_DEBUG__: isDebug,
    __BRANCH__: process.env.BRANCH || '',
    __COMMIT_ID__: process.env.COMMIT_ID || '',
    __BASE__: 'https://hollowverse.com',

    // To avoid issues with cross-origin requests in development,
    // the API endpoint is mapped to an endpoint on the same origin
    // which proxies the requests to the actual defined endpoint
    // The proxy is defined in appServer.ts
    __API_ENDPOINT__: isProd ? process.env.API_ENDPOINT : '/__api',
    'process.env.NODE_ENV': process.env.NODE_ENV,
    'ts-jest': {
      tsConfigFile: 'src/app/tsconfig.json',
      babelConfig: createBabelConfig(true),
    },
  },
  transform: {
    '^.+\\.tsx?$': '<rootDir>/node_modules/ts-jest/preprocessor.js',
  },
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|graphql)$':
      '<rootDir>/src/app/__mocks__/fileMock.js',
    '\\.(css|scss)$': 'identity-obj-proxy',
    '^.+\\.html?$': 'html-loader-jest',
  },
  modulePaths: ['<rootDir>/src/app', '<rootDir>/src'],
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?)$',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  setupFiles: ['<rootDir>/jest.setup.js'],
  setupTestFrameworkScriptFile: '<rootDir>/jest.setupTestFramework.js',
  coverageReporters: ['json'],
  collectCoverageFrom: [
    'src/app/**/*',
    '!src/app/**.d.ts',
    '!**/node_modules/**',
  ],
};
