const { testsDistDirectory } = require('./src/webpack/variables');

const testsPattern = '**/tests/**/*.js';

module.exports = {
  roots: [testsDistDirectory],
  testMatch: [testsPattern],
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
  forceCoverageMatch: [testsPattern],
  collectCoverageFrom: [testsDistDirectory, '!**/node_modules/**'],
};
