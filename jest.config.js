const { testsDistDirectory } = require('./src/webpack/variables');

module.exports = {
  roots: [testsDistDirectory],
  testMatch: ['**/tests/**/*.js'],
  transform: {
    // Must be an empty object to prevent jest from using babel to
    // transform the files (we are already using babel via webpack)
  },
  setupFiles: ['<rootDir>/jest.setup.js'],
  setupTestFrameworkScriptFile: '<rootDir>/jest.setupTestFramework.js',
};
