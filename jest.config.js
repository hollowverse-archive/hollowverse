const { isCi } = require('./src/webpack/env');
const { createBabelConfig } = require('./src/webpack/babel');
const { getAppGlobals } = require('./src/webpack/appGlobals');

module.exports = {
  globals: {
    ...getAppGlobals(true),
    'ts-jest': {
      tsConfigFile: 'src/app/tsconfig.json',
      babelConfig: createBabelConfig(true),
    },
  },
  transform: {
    '^.+\\.tsx?$': '<rootDir>/node_modules/ts-jest/preprocessor.js',
  },
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|ttf|woff|woff2|graphql)$':
      '<rootDir>/src/app/__mocks__/fileMock.js',
    '\\.(svg)$': '<rootDir>/src/app/__mocks__/svgSpriteMock.js',
    '\\.(css|scss)$': 'identity-obj-proxy',
    '\\.html?$': 'html-loader-jest',
  },
  modulePaths: ['<rootDir>/src/app', '<rootDir>/src'],
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?)$',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  setupFiles: ['<rootDir>/jest.setup.js'],
  setupTestFrameworkScriptFile: '<rootDir>/jest.setupTestFramework.js',
  collectCoverage: isCi,
  collectCoverageFrom: [
    'src/app/**/*.{ts,tsx}',
    '!src/app/**.d.ts',
    '!**/node_modules/**',
  ],
};
