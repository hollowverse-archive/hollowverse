const path = require('path');

module.exports = {
  rootDir: 'dist/tests',
  testRegex: 'testEntry\\.(.+)\\.(jsx?|tsx?)$',
  transform: {

  },
  setupFiles: [path.join(__dirname, '/jest.setup.js')],
};
