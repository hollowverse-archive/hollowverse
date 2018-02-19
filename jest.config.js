const { testsDistDirectory } = require('./src/webpack/variables');

module.exports = {
  roots: [testsDistDirectory, '<rootDir>/src'],
  testMatch: ['**/tests/**/*.js'],
  transform: {
    // Must be an empty object to prevent jest from using babel to
    // transform the files (we are already using babel via webpack)
  },
  setupFiles: ['<rootDir>/jest.setup.js'],
  setupTestFrameworkScriptFile: '<rootDir>/jest.setupTestFramework.js',
  mapCoverage: false,
  coverageReporters: ['json'],
  // Jest will exclude test files from code coverage by default,
  // this will force Jest to collect coverage from the compiled
  // test files so that we can map them to the source files.
  forceCoverageMatch: ['__tests__/**/*.js'],
  collectCoverageFrom: ['__tests__/**/*.js', '!**/node_modules/**'],
};
