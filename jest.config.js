const { isCi } = require('@hollowverse/utils/helpers/env');
const { createBabelConfig } = require('./src/webpack/babel');
const { getAppGlobals } = require('./src/webpack/appGlobals');

module.exports = {
  globals: {
    ...getAppGlobals(),
    'ts-jest': {
      tsConfigFile: 'src/app/tsconfig.json',
      babelConfig: createBabelConfig({ isNode: true }),
    },
  },
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  moduleNameMapper: {
    '^.+\\.(gql|graphql)$': 'jest-transform-graphql',
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|ttf|woff|woff2)$':
      '<rootDir>/src/app/__mocks__/fileMock.js',
    '\\.(svg)$': '<rootDir>/src/app/__mocks__/svgSpriteMock.js',
    '\\.(css|scss)$': 'identity-obj-proxy',
    '\\.html?$': 'html-loader-jest',
  },
  modulePaths: ['<rootDir>/src/app', '<rootDir>/src'],
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?)$',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  setupTestFrameworkScriptFile: '<rootDir>/jest.setupTestFramework.js',
  collectCoverage: isCi,
  collectCoverageFrom: [
    'src/app/**/*.{ts,tsx}',
    '!src/app/**.d.ts',
    '!**/node_modules/**',
  ],
  watchPathIgnorePatterns: ['node_modules', 'dist', '.webpack', '.serverless'],
};
