const path = require('path');

const { testsDistDirectory } = require('./src/webpack/variables');

module.exports = {
  roots: [
    testsDistDirectory,
  ],
  testMatch: ['**/tests.js'],
  transform: {
    // Must be an empty object to prevent jest from using babel to
    // transform the files (we are already using babel via webpack)
  },
  setupFiles: [path.join(__dirname, '/jest.setup.js')],
};
