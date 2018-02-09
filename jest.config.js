module.exports = {
  rootDir: 'dist/tests',
  testRegex: 'testEntry\\.(.+)\\.(jsx?|tsx?)$',
  transform: {

  },
  setupFiles: [__dirname + '/jest.setup.js'],
};
