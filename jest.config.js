const path = require('path');

module.exports = {
  roots: [
    'dist/tests',
  ],
  testRegex: 'testEntry\\.(.+)\\.(jsx?|tsx?)$',
  transform: {
    // Must be an empty object to prevent jest from using babel to
    // transform the files (we are already using babel via webpack)
  },
  setupFiles: [path.join(__dirname, '/jest.setup.js')],
};
